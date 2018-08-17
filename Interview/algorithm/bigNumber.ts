class BigNumber {
  result: string;
  constructor(result: string) {
    this.result = result;
  }
  /**
   * 大数加法, 时间复杂度O(n)
   *
   * @param {string} addend 加数
   * @returns instance of BigNumber
   * @memberof BigNumber
   */
  add(addend: string) {
    const result = this.result;
    const maxLen = Math.max(result.length, addend.length);
    const minLen = Math.min(result.length, addend.length);
    const max = (result.length >= maxLen ? result : addend).split('').map(c => parseInt(c));
    const min = (result.length < maxLen ? result : addend).split('').map(c => parseInt(c));
    const results = [0, ...max];
    for (let i = 1; i <= maxLen; ++i) {
      let prev = maxLen - i;
      let curr = maxLen - i + 1;
      let sum = results[curr] + (min[minLen - i] || 0);
      if (sum >= 10) {
        results[prev] = results[prev] + 1;
        results[curr] = sum - 10;
      } else {
        results[curr] = sum;
      }
    }
    this.result = results.join('').replace(/^0*/, '');
    return this;
  }

  /**
   * 大数乘法, 模拟乘法运算，时间复杂度O(n*m)对于处理几百位的乘法没有多大的影响
   *
   * @param {string} multipiler 乘数
   * @returns instance of BigNumber
   * @memberof BigNumber
   */
  mul(multipiler: string) {
    const result = this.result.split('').map(c => parseInt(c));
    const multi = multipiler.split('').map(c => parseInt(c));
    const totalLen = result.length + multi.length + 1;
    const resultLen = result.length;
    const mulLen = multi.length;
    /**
     * typescript 不支持Array(length)后接fill(.fill().map(_=>0))方法...
     * 所以用下面的方法代替了
     */
    const results = [...result, ...multi, 0].map(_ => 0);

    for (let i = 1; i <= resultLen; ++i) {
      for (let j = 1; j <= mulLen; ++j) {
        let sum = result[resultLen - i] * multi[mulLen - j];
        let prev = totalLen - i - j;
        let curr = totalLen - i - j + 1;
        if (sum >= 10) {
          results[prev] = results[prev] + Math.floor((results[curr] + sum) / 10);
          results[curr] = (results[curr] + sum) % 10;
        } else {
          results[curr] = results[curr] + sum;
        }
      }
    }
    this.result = results.join('').replace(/^0*/, '');
    return this;
  }

  valueOf() {
    console.log(this.result);
    return this.result;
  }
}

new BigNumber('999')
  .mul('1000001')
  .add('1')
  .valueOf();
new BigNumber('999').add('1110').valueOf();
