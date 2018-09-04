class Cookie {
  /**
   * 设置cookie
   *
   * @param {string | number} name
   * @param {string | number | object} value
   * @param {object} opts
   * @memberof Cookie
   */
  set(name: string, value: any, {expires = 1, domain = null, path = null}) {
    const exp = new Date();
    exp.setTime(exp.getTime() + expires * 24 * 60 * 60 * 1000);
    let cookie = name + '=' + escape(value) + ';expires=' + exp.toUTCString();
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
  get(name: string) {
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
  delete(name: string) {
    if (this.get(name) !== null) this.set(name, '', {expires: -1});
  }
}
