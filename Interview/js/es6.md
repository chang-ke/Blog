### es6 或更新版本的 常用方法

#### 我能想起常用的大概就是下面的了

#### 新的变量声明符，支持块级作用域

```js
let foo = 'foo';
const bar = 'bar';
bar = 'foo'; // 报错

//解决一个典型的缺乏块级作用域而引发的 “bug"
/**
 * 由于var声明的i作用域同属于当前函数作用域，所以重复声明时只会替换变量i的值
 */
for (var i = 0; i < 5; ++i) {
  setTimeout(function() {
    console.log(i);
  }, i * 500);
}
// 输出5, 5, 5, 5, 5, 5
/**
 * 而let声明的i只属于当前for循环时的块级作用域，所以会有5个i，它们分别作用在5个不同的作用域中
 */

for (let i = 0; i < 5; ++i) {
  setTimeout(function() {
    console.log(i);
  }, i * 500);
}
// 输出0, 1, 2, 3, 4
```

#### Promise, 解决回调或者说是异步编程的问题

```js
//常用fetch，axios就是代表
const parseJSON = response => {
  return response.json();
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
const request = (url, options) => {
  return fetch(`https://cnodejs.org/api/v1${url}`, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({data}))
    .catch(err => ({err}));
};
```

#### 模板字符串、多行字符串

```js
const html = `
<div>
  <span></span>
</div>
`;
const html = `
<div id=${id}>
  <span></span>
</div>
`;
```

#### 解构

```js
const {user} = this.state;
```

#### rest (...)

```jsx
function Wrapper(...props) {
  return (
    <div>
      <SliderThumb />
      <Slider {...props} />
    </div>
  );
}
```

#### 默认参数

```js
function foo(name = 'foo') {
  return name;
}
// 比下面这样好用多了
function foo(name) {
  let _name = typeof name === 'undefined' ? 'foo' : name;
  return _name;
}
```

#### Set(通常用来去重)

```js
const userId = [12, 11, 12, 99, 102, 510];
Array.from(new Set(userId));
```

#### ES6 的模块

```js
import React from 'React';
import * as d3 from 'd3';

export default Slider
export {Slider}
/**
 * 使用 import {Slider} 来导入
 * 你也可以使用import * as R 导入
 * 并如 R.Slider使用
 */
export default {Slider}
/**
 * 使用 import R 导入
 * 如 R.Slider 使用
 */

//还可以这么用
export {default as Slider} from "./slider"
// 这样就不用写两行代码了
import Slider from './slider'
export default Slider
```

#### Class

很多开源库的代码都用 class 重构了，写 React 也提倡使用 class

```js
class Event {
  // 多了个static声明静态属性，使用：Event.length
  static length = 10;
  constructor() {
    this.q = [];
  }
}
// 使用extends进行继承

class Application extends Event {
  listen(...args) {
    console.log(args);
  }
}
```

#### 箭头函数——解决 this 问题和函数式编程的好帮手

```js
// 生成1 到 100之间数的平方
Array(100)
  .fill()
  .map(v => v * v);

document.addEventListener('click', () => {
  console.log(this);
});
```

#### 类数组转数组

```js
// es5:
[].slice.call(arguments);
// es6
Array.from(arguments);
```

#### 对象属性简写

```js
const name = 'tom';

const person = {name};
```

#### 对象属性函数简写

```js
const person = {
  say() {
    console.log('hello');
  },
};
```
