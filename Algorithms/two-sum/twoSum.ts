function twoSum(array: number[], target: number) {
  const hashMap = new Map<number, number>();
  const result: [number, any][] = [];
  array.forEach((item, i) => {
    if (!hashMap.has(item)) {
      hashMap.set(item, i);
    }
  });
  array.forEach((item, i) => {
    const diff = target - item;
    const index = hashMap.get(diff)
    if (hashMap.has(diff) && index !== i) {
      result.push([i, index]);
    }
  });
  return result;
}

console.log(twoSum([1, 2, 5, 2, 9], 3));
