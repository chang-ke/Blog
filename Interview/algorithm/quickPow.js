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
function pow(a, b) {
  for (let i = 0; i < b; ++i) {
    a *= b;
  }
  return a;
}
let a = new Date().getTime();
console.log(quickPow(2, 1000));
console.log(new Date().getTime() - a);
a = new Date().getTime();
pow(2, 1000);
console.log(new Date().getTime() - a);
