class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TimeoutError';
  }
}
/**
 * 提供参数校验和wrapper功能
 *
 * @param {Object or String} defaultOptions
 * @returns {Promise} the request result
 */
function request(defaultOptions) {
  let options = defaultOptions;
  let retryCount = 0;
  if (typeof options === 'string') {
    options = {
      url: defaultOptions,
      method: 'GET',
      timeout: 10000
    };
  }

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

  class Fetch {
    constructor({ timeout, url, retry, ...options }) {
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
          let error = new TimeoutError(`fetch timeout (${this.timeout / 1000}s)`);
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

  return new Promise((resolve, reject) => {
    new Fetch(options)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

request({
  url: 'https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  retry: 2,
  timeout: 660
})
  .then(res => console.log(res))
  .catch(err => console.log(err));

Promise.all([
  request('https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312'),
  request('https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312')
]).then(res => console.log(res));
