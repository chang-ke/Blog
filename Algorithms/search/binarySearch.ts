function binarySearch(array: number[], length: number, target: number) {
  let low = 0;
  let high = length;
  let middle = 0;

  while (low < high) {
    middle = (low + high) / 2;
    if (target === array[middle]) {
      return target;
    } else if (target < array[middle]) {
      high = middle;
    } else if (target > array[middle]) {
      low = middle + 1;
    }
  }
  return -1;
}

class Singleton {
  private static instance: Singleton;

  public static getInstance() {
    if (this.instance === null) {
      this.instance = new Singleton();
    }
    return this.instance;
  }
}