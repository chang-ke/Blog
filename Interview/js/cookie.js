class Cookie {
  /**
   * 设置cookie
   *
   * @param {string | number} name
   * @param {string | number | object} value
   * @param {object} opts
   * @memberof Cookie
   */
  set(name, value, {expires = 1, domain, path}) {
    const exp = new Date();
    exp.setTime(exp.getTime() + expires * 24 * 60 * 60 * 1000);
    let cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
    if (domain) {
      cookie += ';domain=' + domain;
    }
    if (path) {
      cookie += ';path=' + path;
    }
    document.cookie = cookie;
  }
  /**
   * 获取cookie
   *
   * @param {string} name
   * @returns value
   * @memberof Cookie
   */
  get(name) {
    const result = document.cookie.match(new RegExp(name + '=[^;]+'));
    if (result) return result[0].split('=')[1];
    else return null;
  }
  /**
   * 删除cookie
   *
   * @param {string} name
   * @memberof Cookie
   */
  delete(name) {
    if (this.get(name) !== null) this.set(name, '', {expires: -1});
  }
}

let cookie = new Cookie();
cookie.set('test', 'value', {path: '/', expires: 365});
console.log(cookie.get('test'));
cookie.delete('test');
