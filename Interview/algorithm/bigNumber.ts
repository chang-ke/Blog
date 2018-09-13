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
    function getDotIndex(number) {
      let index = number.length - number.indexOf('.') - 1;
      return index === number.length ? 0 : index;
    }
    let result = this.result;
    const rIndex = getDotIndex(result);
    const aIndex = getDotIndex(addend);
    const dotLength = Math.max(rIndex, aIndex);
    result = result.replace('.', '');
    addend = addend.replace('.', '');
    if (rIndex > aIndex) addend += '0'.repeat(rIndex - aIndex);

    if (rIndex < aIndex) result += '0'.repeat(aIndex - rIndex);

    const maxLen = Math.max(result.length, addend.length);
    const minLen = Math.min(result.length, addend.length);
    const max = (result.length >= maxLen ? result : addend).split('').map(c => parseInt(c));
    const min = (result.length < maxLen ? result : addend).split('').map(c => parseInt(c));
    let results: any = [0, ...max];
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

    if (dotLength !== 0) results.splice(results.length - dotLength, 0, '.');
    this.result = results.join('').replace(/^(0*)/, '');
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
    function getDotLength(result, multipiler) {
      const rLen = result.length - result.indexOf('.') - 1;
      const mLen = multipiler.length - multipiler.indexOf('.') - 1;
      if (rLen === result.length && mLen === multipiler.length) return -1;
      if (rLen === result.length) return mLen;
      if (mLen === multipiler.length) return rLen;
      return rLen + mLen;
    }
    let result: any = this.result;
    const dotLength = getDotLength(result, multipiler);
    result = result.replace('.', '');
    multipiler = multipiler.replace('.', '');
    result = result.split('').map(c => parseInt(c));
    const multi = multipiler.split('').map(c => parseInt(c));
    const totalLen = result.length + multi.length + 1;
    const resultLen = result.length;
    const mulLen = multi.length;
    const results: any = Array(totalLen).fill(0);
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
    if (dotLength > 0) {
      results.splice(results.length - dotLength, 0, '.');
      this.result = results
        .join('')
        .replace(/^0*/, '')
        .replace(/\.0*$/, '');
    } else {
      this.result = results.join('').replace(/^0*/, '');
    }

    return this;
  }

  valueOf() {
    console.log(this.result);
    return this.result;
  }
}

new BigNumber('0.999')
  .mul('1000001')
  .add('1')
  .valueOf();
new BigNumber('999').add('1110').valueOf();
