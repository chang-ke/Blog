/**
 * 减层函数
 * 非递归版
 * @param {array} list
 * @param {number} depth
 */
function flatten(list: Array<any>, depth: number) {
  while (list.some(item => Array.isArray(item)) && depth-- > 0) {
    list = [].concat(...list);
  }
  return list;
}

console.log(flatten([1, [2, [3]]], 1));
