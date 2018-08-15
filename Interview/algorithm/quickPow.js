/**
 *
 *
 * @param {number} a 底数
 * @param {number} b 指数
 */
function quickPow(a, b) {
  let ans = 1;
  while (b != 0) {
    if (b & 1) ans = ans * a; //如果b的二进制位不是0，那么我们的结果是要参与运算的
    b >>= 1;
    a = a * a;
  }
  return ans;
}

console.log(quickPow(2, 10));
