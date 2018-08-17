class MinHeap {
  k: number;
  arr: Array<number>;
  constructor(k) {
    this.k = k;
    this.arr = [];
  }
  /**
   *
   *
   * @param {number} val
   * @memberof MinHeap
   */
  push(val: number) {
    const {arr, k} = this;
    if (arr.length < k) {
      arr[arr.length] = val;
      for (let i = arr.length - 1; arr[i] < arr[Math.floor(i / 2)]; i /= 2) {
        [arr[Math.floor(i / 2)], arr[i]] = [arr[i], arr[Math.floor(i / 2)]];
      }
    } else if (val > arr[0]) {
      arr[0] = val;
      for (let i = 0; i < k; ) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        if (left >= k) break;
        /**
         * 均大于子节点，选取较小的交换
         */
        if (val > arr[left] && val > arr[right]) {
          if (arr[left] > arr[right]) {
            [arr[i], arr[right]] = [arr[right], arr[i]];
            i = right;
          }
          if (arr[left] < arr[right]) {
            [arr[i], arr[left]] = [arr[left], arr[i]];
            i = left;
          }
        } else {
          if (val > arr[left]) {
            [arr[i], arr[left]] = [arr[left], arr[i]];
            i = left;
          } else if (val > arr[right]) {
            [arr[i], arr[right]] = [arr[right], arr[i]];
            i = right;
          } else {
            break; // 比它的两个子元素都要小
          }
        }
      }
    }
  }
  getTop() {
    return this.arr[0];
  }
}

function topK(arr: Array<number>, k: number) {
  const m = new MinHeap(k);
  arr.forEach(v => m.push(v));
  console.log(m);
  return m.getTop();
}

console.log('第%d大的值为%d', 5, topK([5, 120, 99, 8, 9, 11, 120, 20], 5));
