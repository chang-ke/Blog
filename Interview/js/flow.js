const result = Array(Math.ceil(parseInt(1000 / 7) / 2))
  .fill()
  .map((_, i) => i * 14 + 7)
  .reduce((sum, current) => Math.pow(current, 2) + sum, 0);

console.log(result);

(async function flow() {
  const sleep = time =>
    new Promise(resovle => {
      setTimeout(() => {
        console.log(1);
        resovle(1);
      }, time);
    });
  const q = [sleep, [sleep, sleep], sleep];
  for (let i = 0; i < q.length; ++i) {
    let item = q[i];
    if (Array.isArray(item)) {
      await Promise.all(item.map(fn => fn(1000)));
    } else {
      await item(1000);
    }
  }
})();
