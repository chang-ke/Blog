/**
 * 验证邮箱
 *
 * @param {string} email
 * @returns
 */
function matchEmail(email: string) {
  return /^[^@]+@[^\.]+\.(com|cn)/.test(email);
}

console.log(matchEmail('315764194@qq.com'));
/**
 * 提取url的主域名
 *
 * @param {string} url
 * @returns
 */
function matchDomain(url: string) {
  let match = url.match(/http(s)?:\/\/[\w\W]+\//);
  return match && match[0];
}

console.log(matchDomain('https://taobao.com/home?price=6'));
/**
 * 利用位置匹配实现，即要求不是开头且后面紧接3的倍数个数字的位置替换为 ‘,’
 * 为什么要求是不是开头呢？因为当字符串长度为3的倍数时，我们不希望出现如 123456 => ,123,456的结果
 * @param {string} str
 * @returns
 */
function formate(str: string) {
  return str.replace(/(?!^)(?=(\d{3})+$)/g, ',');
}

console.log(formate('1234567'));