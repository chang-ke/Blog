/**
 * 判断对象是否存在循环引用，该思想还可用于链表，二叉树等的判断
 *
 * @param {object} o 需要判断的对象
 * @returns
 */
function validateCircularRefrence(o) {
  const q = [];
  /**保存访问当前节点的路径，并判断当前节点是否与路径上的节点相等 */
  return (function dfs(origin) {
    if (!origin) return;
    for (let parent of q) {
      if (typeof origin === 'object' && parent === origin) {
        return true;
      }
    }
    q.push(origin);
    if (typeof origin === 'object') {
      Object.keys(origin).forEach(key => {
        dfs(origin[key]);
      });
    }
    q.pop();
  })(o);
}
