#### 起因
我在网上看到很多关于fetch timeout的封装，但是我觉得是伪timeout，只是抛错，但是fetch的Promise链会一直执行下去
```js
Promise.race([
  fetch('/api')
    .then(res => res.json())
    .then(res => console.log(555)),
  new Promise(function(resolve, reject) {
    setTimeout(() => {
      reject(new Error('request timeout'));
      console.log(111);
    }, 100);
  })
]);
```
结果:
![image.png](https://dn-cnode.qbox.me/FpZJypVaAB8VW_1ayoB7kJYCtmIC)
可以看到就算超时后，fetch请求仍按正常顺序执行，输出了555，超时一般会重新请求，这样到最后就有可能输出2次或者多次555，试想如果你在then函数里面执行setState操作，这样视图就会更新2次或者多次，这样显然不是我们想要的结果，我们想要的是获取结果后执行一次

#### 针对以上缺点进行改进
于是我封装以下代码，支持timeout（我这个其实也是伪timeout，没办法，除非使用xhr，但是超时后Promise链只会执行报错，因为结果和报错使用同一个Promise）和重新请求，由于返回值是一个Promise，用法和fetch保持一致
支持```Promise.all,.race```方法

代码[地址](https://github.com/xuan45/Blog/tree/master/Frontend)
```js
class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * 提供参数校验和wrapper功能
 *
 * @param {*} url
 * @param {*} [options={ method: 'GET' }]
 * @returns {Promise} the request result
 */
function request(url, options = { method: 'GET' }) {
  let retryCount = 0;

  let parseJSON = response => {
    return response.json();
  };

  let checkStatus = response => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }

    let error = new Error(response.statusText);
    error.response = response;
    throw error;
  };

  class Request {
    constructor(url, { retry, timeout, ...options }) {
      this.url = url;
      this.retry = retry || 0;
      this.timeout = timeout || 10000;
      this.options = options;
    }

    then(fn) {
      let done = false;
      setTimeout(() => {
        // 无论是请求重试还是最终超时错误，此次请求得到的结果作废
        if (retryCount < this.retry && !done) {
          done = true;
          retryCount++;
          this.then(fn);
        } else {
          let error = new TimeoutError(`timeout of ${this.timeout}ms execeeded`);
          this.catchError(error);
        }
      }, this.timeout);

      fetch(this.url, this.options)
        .then(checkStatus)
        .then(parseJSON)
        .then(res => {
          // 未进入重试或者超时错误，返回结果
          if (!done) {
            fn(res);
            done = true;
          }
        })
        .catch(err => {
          this.catchError(err);
        });

      return this;
    }

    catch(fn) {
      this.catchError = fn;
    }
  }

  return new Promise((resolve, reject) =>
    new Request(url, options).then(res => resolve(res)).catch(err => reject(err))
  );
}

request('/api', {
  retry: 2,
  timeout: 1000
}).then(res => console.log(res))

```

#### 使用封装后的fetch进行请求

设置Cache-Control:2s和timeout:1000ms后的请求情况
可以看到1.49s后请求才完全响应，而我们设置了1s重新请求，所以第二次请求由于上次请求缓存未失效的原因，在1.49s的时候利用了上次请求作为结果进行了响应
设置缓存，第一次超时请求结果作废(then函数不执行)，第二次请求直接拿了第一次的缓存，这样减少了请求响应时间还减轻了服务器的压力
![image.png](https://dn-cnode.qbox.me/Ft_CueLApRmrvmQTYwl2ZXUY5uqI)
![image.png](https://dn-cnode.qbox.me/FqBdvcDexMll0Su_OVKQ9fFhcz7I)

-------------------------------------------------
![image.png](https://dn-cnode.qbox.me/Figl7w6nyv460nq8Z8XODBcJ0F8C)
![image.png](https://dn-cnode.qbox.me/FqBdvcDexMll0Su_OVKQ9fFhcz7I)
不设置缓存，如果网络那段时间不太好，第三次请求才顺利拿到结果，也有可能第二次拿到请求，抑或是重试2次以后还是超时了
![image.png](https://dn-cnode.qbox.me/FpZUKujLUSd9eele6X5dP-F6ABST)
![image.png](https://dn-cnode.qbox.me/FgKVzChVaLopyEkJLPlvsRdnugMI)

请求重试最好跟cache-control配合使用，这样当前面请求超时结果作废后，第二次请求会等到第一次请求结果的返回，前提是缓存没有失效
缓存失效时间是从响应开始时计算的，一般配合超时重新请求的话，timeout设置为正常响应的1.5倍，max-age应该设置为timeout的1.5+倍（或者为timeout的2倍，方便利用上次响应结果），具体数值需要根据具体情况合理设置

可能最后会有人有这样的疑问，你使用缓存，即上一次请求超时响应的结果，那还不如Promise.race的方法简单，一样的效果
使用缓存的优势就是如果第一次超时响应的时间短于timeout加正常响应甚至又一次超时的时间，而且缓存没有失效，那么既节省了时间又节省了服务器的压力，假如失效了呢？重新请求呗！不管怎样，利用缓存绝对是比不利用的好