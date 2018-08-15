/**
 * 查找缺失的数, 用求和的方式时需要考虑溢出
 *
 * @param {array} a
 * @param {array} b
 */
function find(a: Array<number>, b: Array<number>) {
  let sumA = a.reduce((pre, cur) => pre + cur, 0);
  let sumB = b.reduce((pre, cur) => pre + cur, 0);
  return sumA - sumB;
}

console.log(find([1, 2, 3, 5], [2, 1, 3]));
