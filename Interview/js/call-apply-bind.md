#### 三者都可以改变 this 指向，call,apply 调用后函数会立即执行，bind 调用后返回一个函数

#### call 和 apply 的区别

call 和 apply 都是为了解决改变 this 的指向。作用都是相同的，只是传参的方式不同。

除了第一个参数外，call 可以接收一个参数列表，apply 只接受一个参数数组。

```js
const other = {
  value: 1,
};
function print(name, age) {
  console.log(name);
  console.log(age);
  console.log(this.value);
}
print.call(other, 'jeck', '20');
print.apply(other, ['jeck', '20']);
```

#### bind

bind 第一个参数为 null 时 this 不改变指向

```js
const other = {
  value: 1,
};
function print(name, age) {
  console.log(name);
  console.log(age);
  console.log(this.value);
}
print.bind(other, 'jeck')('20');
```
