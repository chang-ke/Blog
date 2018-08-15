class MinHeap {
  arr: Array<number>;
  constructor(k) {
    this.arr = Array(k);
  }
  push(val: number) {}
  getTop() {
    return this.arr[0];
  }
}

function topK(arr: Array<number>, k: number) {
  const m = new MinHeap(k);
  return m.getTop();
}
