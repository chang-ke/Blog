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
})
  .then(res => console.log(res))
  // .catch(err => console.log(err));

// Promise.all([
//   request('api'),
//   request('api')
// ]).then(res => console.log(res));
