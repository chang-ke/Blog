/**
 * 思路： 找到字符串切割点，然后原字符串切割后反转拼接判断
 * @param {string} a 源字符串
 * @param {string} b 切割后反转的字符串
 */

function judge(a, b) {
  let _a = a.split('');
  let index = _a.findIndex(_ => _ === b[0]);
  let c = _a.splice(index).join('');
  return c + _a.join('') === b;
}

console.log(judge('12345', '34512'));
