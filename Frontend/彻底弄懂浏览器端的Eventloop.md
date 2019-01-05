

## 前言

> 写这篇文章的起因是在群里看到了各位再讨论这部分的内容，这一块自己也不太懂，一时手痒就写了这篇文章这一块很多初学者也是一知半懂，学到一半发现又麻烦又复杂，索性放弃了。
本来打算考完操作系统就写完的，结果又遇到了CPU课设...所以这篇文章断断续续写了很多天

----

## Event Loop

简单点讲 event loop 就是对JS代码执行顺序的一个规定（任务调度算法）

先看看两幅图

**JS engine**

> via: sessionstack

<div align=center>
  <img src="https://user-gold-cdn.xitu.io/2019/1/5/1681c74cd43aceb9?w=883&h=662&f=png&s=26318"/>
</div>

**JS runtime**

> via: sessionstack

<div align=center>
  <img src="https://user-gold-cdn.xitu.io/2019/1/5/1681c75687cfac18?w=883&h=662&f=png&s=65393"/>
</div>

NOTE：
> 一个 web worker 或者一个跨域的 iframe 都有自己的栈，堆和消息队列。两个不同的运行时只能通过 postMessage 方法进行通信。如果另一运行时侦听 message 事件，则此方法会向其添加消息。

**HTML Eventloop**

> via: https://livebook.manning.com/#!/book/secrets-of-the-javascript-ninja-second-edition/chapter-13/
这幅图就是对whatwg组织制定HTML规范中的event loop的可视化

<div align=center>
  <img src="
https://user-gold-cdn.xitu.io/2019/1/5/1681c75cd2176add?w=866&h=1106&f=png&s=173547"/>
</div>

我们通常在编写 web 代码的时候，都是和**JS runtime**打交道

### 同步代码

毫无疑问是按顺序执行

```js
console.log(2); // 非异步代码
console.log(3); // 非异步代码
```

显然结果是 2 3

### 非阻塞代码

一般分为两种任务，macroTasks 和 microTasks

event loop 里面有维护了两个不同的异步任务队列 macroTasks(Tasks) 的队列microTasks 的队列

- 宏任务包括：setTimeout, setInterval, setImmediate, I/O, UI rendering

- 微任务包括： 原生 Promise(有些实现的 Promise 将 then 方法放到了宏任务中), Object.observe(已废弃), MutationObserver， MessageChannel

**每次开始执行一段代码（一个 script 标签）都是一个 macroTask**

1、event-loop start

2、从 macroTasks 队列抽取一个任务，执行

3、microTasks 清空队列执行，若有任务不可执行，推入下一轮 microTasks

4、检查 microTasks 是否清空，若有则跳到 2，无则跳到 3

5、结束 event-loop

浏览器执行代码的真正过程是下面整个流程，而我们编写代码感知的过程是红框里面的（**所以以后要是有人再问起你macroTask和microTask哪个先执行，可别再说microTask了**）

值得一提的是，在HTML标准中提到了一个 compound microtasks 当它执行时可能会去执行一个subTask

<div align=center>
  <img src="https://user-gold-cdn.xitu.io/2019/1/5/1681c766b471b172?w=913&h=712&f=png&s=31274"/>
</div>
例：

```js
setTimeout(() => {
  console.log(123);
});

const p = Promise.resolve(
  new Promise(resolve => {
    setTimeout(() => {
      resolve('p');
      console.log(55);
    }, 1000);
    new Promise(resolve => {
      resolve('p1');
    }).then(r => console.log(r));
  })
);

setTimeout(() => {
  console.log(456);
});

p.then(r => console.log(r));
```

大家可以先猜猜这段代码的执行顺序，相信如果没有上面的介绍，我觉得很多人在这就晕了
不过有了上面的介绍加上咱们一步一步的分析，你一定会明白的

- 第一步，代码执行到第一个 setTimeout 打印 123 的函数推入宏任务队列
- 第二部，代码执行到 Promse.resolve 里面的 new Promise，啥也没干...继续执行下面的代码
- 第三步，代码执行到 new Promise 里面的 setTimeout，打印 55 的函数推入宏任务队列
- 第四步，代码执行到 new Promise 里面的 new Promise，执行构造函数，再把 then 函数推入微任务队列
- 第五步，代码执行到第一个 setTimeout 打印 456 的函数推入宏任务队列
- 第六步，代码执行到最后一个 p.then，推入微任务队列

> 函数名后面的数字或者变量，是这个函数打印的东西，借此区分函数

扫描完这些代码，各任务队列的情况如下图（注意此时由浏览器提供的setTimeout会检查各定时任务是否到时间，如果到了则推入任务队列，所以此时定时1000ms的回调函数并未出现在macroTask中）
然后执行完同步代码，开始按上面介绍的情况开始执行 macro Task 和 micro Task
![](https://user-gold-cdn.xitu.io/2019/1/5/1681c76a3c6bffcb?w=737&h=497&f=png&s=22910)


先执行 micro Task，拿出 p.then p1 发现可执行，打印 p1；然后拿出 p.then p 发现不可执行，即 status 为“pending”, 这一轮 micro Task 执行完毕
开始执行 macro Task，拿出 setTimeout 123，发现可执行（此时同步代码已执行完毕），打印 123，检查执行 micro Task， p.then p 依旧不可执行
等到 macro Task 执行完一段时间，发现 micro Task 里面的 p.then p 可执行了，打印，结束 event loop

所以这一段代码的打印结果是

```java
5
p1
123
456
55
p
```


你有做对吗，这只是小 case，还没加上 async 函数呢，接下来看看 async 函数

## async/await

当一个 async 函数里面执行 await 的时候，其实是标志这个 async 函数要让出线程了(我个人觉得这就像执行 一个特殊的 函数一样，该函数会推进第一轮微任务队列末尾)，当 async 函数里面的 await 语句后面的函数或者表达式执行完，该函数立马退出执行，调用栈也会撤销, 当本轮事件循环完毕的时候又会回来执行剩下的代码

再来看看 MDN 咋说的

An async function can contain an await expression that pauses the execution of the async function and waits for the passed Promise's resolution, and then resumes the async function's execution and returns the resolved value.

翻译过来就是 async 函数可以包含一个 await 表达式，该表达式暂停执行 async 函数并等待返回的 Promise resovle/reject 完成，然后恢复 async 函数的执行并返回已解析的值

看完你应该知道为啥 await 表达式会让 async 函数让出线程了吧？(如果不让出线程，还不如写同步代码了，阻塞后面所有代码), 结合前面的 Event Loop，可以确定，await 表达式需要等待 Promise 解析完成，await 恢复 async 函数执行需要等待执行完第一轮微任务以后，毕竟不是每个async函数都是直接返回一个非Promise的值或者立即解析的Promise，所以等mainline JS执行完还需要等待一轮event loop

##### await 阻塞什么代码的执行

await 阻塞的是当前属于 async 函数作用域下后面的代码

##### 什么时候恢复被阻塞的代码的执行？

答案是当每一轮 microTask 执行完毕后恢复，具体哪一轮，看返回的 Promise 什么时候解析完成

#### 进入正题，看看 async/await

```js
async function b() {
  console.log('1');
}

async function c() {
  console.log('7');
}

async function a() {
  console.log('2');
  await b();
  //console.log(3);
  await c();
  console.log(8);
}

a();
console.log(5);
Promise.resolve()
  .then(() => {
    console.log(4);
  })
  .then(() => {
    console.log(6);
  });

new Promise(resolve => {
  setTimeout(() => resolve(), 1000);
}).then(() => console.log(55555555));

setTimeout(() => {
  console.log(123);
});
```

有了上面的解释，加上下面这个 GIF，上面这段代码执行过程一目了然了
我就不再赘述了，大家直接看我单步执行这些代码顺序应该就懂了（使用了定时器可能单步调试打印的信息可能会和正常执行不一样）

<div align=center>
  <img src="https://user-gold-cdn.xitu.io/2019/1/5/1681c76edf516090?w=547&h=901&f=gif&s=299288)"/>
</div>

## 总结

- #### macroTask和microTask哪个先执行

macroTask先执行（毕竟标准就是这么定的），至于为什么，我个人认为是因为macroTask都是和用户交互有关的事件，所以需要及时响应

- #### async 函数做了什么
async函数里面可以使用await表达式，async函数的返回值会被Promise.resolve包裹(返回值是一个Promise对象就直接返回该对象)
```js
// 验证
const p = new Promise(resolve => resolve());
console.log(p === Promise.resolve(p)) // true
```
- #### await 语句做了什么

await 语句会先执行其后面的表达式，(如果该表达式是函数且该函数里面遇到await，则会按同样的套路执行)，然后阻塞属于当前 async 函数作用域下后面的代码

- #### 什么时候恢复 await 语句后面代码的执行

当执行完 await 语句之后的 某一轮 eventloop 结束后恢复执行（它需要等待它右侧的返回的Promise解析完成，而Promise解析可能是同步的（new Promise），也可能是异步的（.then），而then回调需要等到eventloop最后去执行）

### 参考资料
|来源|链接|
|---|---|
|IMWeb 前端博客|  [http://imweb.io/](http://imweb.io/)|
|MDN      |      [https://developer.mozilla.org/en-US/](https://developer.mozilla.org/en-US/)|
|前端精读周刊  |   [https://github.com/dt-fe/weekly](https://github.com/dt-fe/weekly/blob/master/55.%E7%B2%BE%E8%AF%BB%E3%80%8Aasync%20await%20%E6%98%AF%E6%8A%8A%E5%8F%8C%E5%88%83%E5%89%91%E3%80%8B.md)|
|sessionstack| [https://blog.sessionstack.com/](https://blog.sessionstack.com/)|
|v8 博客 fastasync(中文版)| [https://v8.js.cn/blog/fast-async/](https://v8.js.cn/blog/fast-async/)
|Tasks, microtasks, queues and schedules| [https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
|Secrets of the JavaScript Ninja| [https://livebook.manning.com/#!/book/secrets-of-the-javascript-ninja-second-edition/chapter-13/71](https://livebook.manning.com/#!/book/secrets-of-the-javascript-ninja-second-edition/chapter-13/71)
