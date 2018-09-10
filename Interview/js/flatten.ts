/**
 * 减层函数
 * 非递归版
 * @param {array} list
 * @param {number} depth
 */
function flattenArray(list: Array<any>, depth: number) {
  while (list.some(item => Array.isArray(item)) && depth-- > 0) {
    list = [].concat(...list);
  }
  return list;
}

console.log(flattenArray([1, [2, [3]]], 1));

/**
 * 扁平化数组
 *
 * @param {Array<any>} list
 * @returns
 */
function flatten(list: Array<any>) {
  const array: Array<number> = [];
  function flatten(args: any) {
    if (Array.isArray(args)) {
      args.forEach(v => {
        flatten(v);
      });
    } else if (Object.prototype.toString.call(args) === '[object Object]') {
      Object.getOwnPropertyNames(args).forEach(key => {
        flatten(args[key]);
      });
    } else {
      array.push(args);
    }
  }
  flatten(list);
  return array;
}

console.log(flatten([1, 2, [3, 4], [5, 6], {a: 7}]));
