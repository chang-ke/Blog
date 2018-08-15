/**
 * 思路： 找到字符串切割点，然后原字符串切割后反转拼接判断
 * @param {string} a 源字符串
 * @param {string} b 切割后反转的字符串
 */

function judge(a, b) {
  for (let i = 0; i < a.length; ++i) {
    let origin = a.split('');
    if (origin[i] === b[0]) {
      let target = origin.splice(i).join('');
      if (target + origin.join('') === b) return true;
    }
  }
  return false;
}

console.log(judge('123456', '34512'));
console.log(judge('334', '343'));
