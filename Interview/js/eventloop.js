console.log('script start');
setTimeout(() => {
  console.log('timeout');
}, 0);

Promise.resolve()
  .then(() => {
       console.log('then');
  })
  .catch(() => {
    console.log('catch');
  });
//   .finally(() => {     console.log('finally');   });

(async() => {
  console.log(
  // await语法同样是假如微任务，且在catch前执行？
  await new Promise(resolve => {
    //作为构造函数执行时立即打印
    console.log('async start');
    resolve('async');
  }));
})();

process.nextTick(() => {
  console.log('nextTick');
});
console.log('script end');
