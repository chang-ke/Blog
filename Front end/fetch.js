class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TimeoutError';
  }
}

function request(defaultOptions) {
  let options = defaultOptions;
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
    constructor({ timeout, ...options }) {
      this.url = options.url;
      this.timeout = timeout || 10000;
      this.options = options;
    }

    then(fn) {
      let success = false;
      setTimeout(() => {
        if (!success) {
          let error = new TimeoutError(`fetch timeout (${this.timeout / 1000}s)`);
          this.catchError(error);
        }
      }, this.timeout);
      
      fetch(this.url, this.options)
        .then(checkStatus)
        .then(parseJSON)
        .then(res => {
          if (!success) {
            fn(res);
            success = true;
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
  timeout: 66
})
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });

Promise.all([
  request('https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312'),
  request('https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312')
]);
