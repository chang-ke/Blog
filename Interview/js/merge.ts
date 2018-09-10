/**
 * 合并有序数组
 *
 * @param {Array<number>} a
 * @param {Array<number>} b
 * @returns {Array<number>}
 */
function merge(a: Array<number>, b: Array<number>): Array<number> {
  const array: Array<number> = [];
  const alen = a.length;
  const blen = b.length;
  let i = 0;
  let j = 0;
  while (!(i >= alen && j >= blen)) {
    if ((i >= alen || a[i] >= b[j]) && j < blen) {
      array.push(b[j]);
      j++;
    }
    if ((j >= blen || a[i] < b[j]) && i < alen) {
      array.push(a[i]);
      i++;
    }
  }
  return array;
}
