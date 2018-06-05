function Fetch(options) {
  let defaultOptions = {
    method: 'GET'
  };
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
  class _Fetch {
    constructor({ timeout, ...options }) {
      this.stack = [];
      this.url = options.url;
      this.timeout = timeout;
      this.options = options;
    }

    timeout(timeout) {
      this.timeout = timeout;
      return this;
    }

    then(fn) {
      let success = false;
      let startTime = new Date().getTime();
      let isJSON = this.options.headers['Content-Type'].indexOf('json') > -1;
      setTimeout(() => {
        let catchs = this.catch.bind(this);
        if (!success) {
          success = true;
          this.catch(new Error('timeout'));
        } else {
          console.log('请求已成功');
        }
      }, this.timeout);
     
      isJSON
        ? fetch(this.url, this.options)
            .then(checkStatus)
            .then(parseJSON)
            .then(res => {
              let endTime = new Date().getTime();
              if (endTime - startTime > this.timeout) {
                if (!success) throw new Error('timeout');
                success = true;
              } else {
                fn(res);
                success = true;
              }
            })
            .catch(err => {
              this.catch(err);
            })
        : fetch(this.url, this.options)
            .then(checkStatus)
            .then(fn);
      return this;
    }
    catch(fn) {
      this.catch = fn;
    }
  }

  return new _Fetch(options);
}

Fetch({
  url: 'https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312',
  method: 'GET',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 6600
})
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
