class MinHeap {
  k: number;
  array: Array<number>;
  constructor(k) {
    this.k = k;
    this.array = [];
  }
  /**
   *
   *
   * @param {number} val
   * @memberof MinHeap
   */
  push(val: number) {
    const {array, k} = this;
    if (array.length < k) {
      array[array.length] = val;
      for (let i = array.length - 1; array[i] < array[Math.floor(i / 2)]; i /= 2) {
        [array[Math.floor(i / 2)], array[i]] = [array[i], array[Math.floor(i / 2)]];
      }
    } else if (val > array[0]) {
      array[0] = val;
      for (let i = 0; i < k; ) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        if (left >= k) break;
        /**
         * 均大于子节点，选取较小的交换
         */
        if (val > array[left] && val > array[right]) {
          if (array[left] > array[right]) {
            [array[i], array[right]] = [array[right], array[i]];
            i = right;
          }
          if (array[left] < array[right]) {
            [array[i], array[left]] = [array[left], array[i]];
            i = left;
          }
        } else {
          if (val > array[left]) {
            [array[i], array[left]] = [array[left], array[i]];
            i = left;
          } else if (val > array[right]) {
            [array[i], array[right]] = [array[right], array[i]];
            i = right;
          } else {
            break; // 比它的两个子元素都要小
          }
        }
      }
    }
  }
  getTop() {
    return this.array[0];
  }
}

function topK(array: Array<number>, k: number) {
  const m = new MinHeap(k);
  array.forEach(v => m.push(v));
  console.log(m);
  return m.getTop();
}

console.log('第%d大的值为%d', 5, topK([5, 120, 99, 8, 9, 11, 120, 20], 5));
