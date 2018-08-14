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
