#### 前言：

> 说实话，这半年来在各大社区看别人分享的面试题中 bind 函数已经出现 n 多次了，这次准备详细探究下

首先让我们看看 mdn 对于 bind 函数的描述是什么

### 语法

> fun.bind(thisArg[, arg1[, arg2[, ...]]])

#### 参数

* **thisArg**
  &nbsp;&nbsp;当绑定函数被调用时，该参数会作为原函数运行时的 this 指向。当使用 new 操作符调用绑定函数时，该参数无效。
* **arg1, arg2, ...**
  &nbsp;&nbsp;当绑定函数被调用时，这些参数将置于实参之前传递给被绑定的方法。

#### 返回值

&nbsp;&nbsp;返回由指定的 this 值和初始化参数改造的原函数拷贝

---

当代码 new Foo(...) 执行时，会发生以下事情：
1、一个继承自 Foo.prototype 的新对象被创建。
2、使用指定的参数调用构造函数 Foo ，并将 this 绑定到新创建的对象。new Foo 等同于 new Foo()，也就是没有指定参数列表，Foo 不带任何参数调用的情况。
3、由构造函数返回的对象就是 new 表达式的结果。如果构造函数没有显式返回一个对象，则使用步骤 1 创建的对象。（一般情况下，构造函数不返回值，但是用户可以选择主动返回对象，来覆盖正常的对象创建步骤）如果你看不懂这段话，没关系，看完下面这段代码你就清楚了

```js
function Foo(){

}
下面代码就是执行new Foo()时的简单实现
let obj = {};
obj.__proto__  = Foo.prototype
return Foo.call(obj)
```

---

### 实现

#### 乞丐版, 无法预先填入参数，仅实现执行时改变 this 指向

```js
let obj = {
  ll: 'seve'
};

Function.prototype.bind = function(that) {
  var self = this;
  return function() {
    return self.apply(that, arguments);
  };
};
let func0 = function(a, b, c) {
  console.log(this.ll);
  console.log([a, b, c]);
}.bind(obj, 1, 2);

func0(3); // seve
// [ 3, undefined, undefined ] 发现1，2并没有填入
```

乞丐版也太 low 了对吧，所以我们继续完善

#### es6 进阶版

es6 提供了结构运算符，可以很方便的利用其功能实现 bind

```js
Function.prototype.bind = function(that, ...argv) {
  if (typeof this !== 'function') {
    throw new TypeError(`${this} is not callable`);
  }
  // 保存原函数
  let self = this;
  // 获取bind后函数传入的参数
  return function(...arguments) {
    return self.apply(that, [...argv, ...arguments]);
  };
};
let func1 = function(a, b, c) {
  console.log(this.ll);
  console.log([a, b, c]);
}.bind(obj, 1, 2);

func1(3); // seve
// [ 1, 2, 3 ]
```

es6 版实现很简单对吧，但是面试官说我们的运行环境是 es5，这时你心中窃喜，bable 大法好，但是你可千万不要说有 babel，因为面试官的意图不太可能是问你 es6 如何转换成 es5，而是考察你其他知识点，比如下面的类数组如何转换为真正的数组

#### es5 进阶版

```js
Function.prototype.bind = function() {
  if (typeof this !== 'function') {
    throw new TypeError(`${this} is not callable`);
  }
  var self = this;
  var slice = [].slice;
  // 模拟es6的解构效果
  var that = arguments[0];
  var argv = slice.call(arguments, 1);
  return function() {
    // slice.call(arguments, 0)将类数组转换为数组
    return self.apply(that, argv.concat(slice.call(arguments, 0)));
  };
};
let func2 = function(a, b, c) {
  console.log(this.ll);
  console.log([a, b, c]);
}.bind(obj, 1, 2);

func2(3); // seve
// [ 1, 2, 3 ]
```

当然，写到这里，对于绝大部分面试，这份代码都是一份不错的答案，但是为了给面试官留下更好的印象，我们需要上终极版
实现完整的bind函数，这样还可以跟面试官吹一波

#### 终极版

为了当使用new操作符时，bind后的函数不丢失this。我们需要把bind前的函数的原型挂载到bind后函数的原型上

但是为了修改bind后函数的原型而对bind前的原型不产生影响，都是对象惹的祸。。。直接赋值只是赋值对象在堆中的地址
所以需要把原型继承给bind后的函数，而不是直接赋值，我有在一些地方看到说Object.crate可以实现同样的效果，有兴趣的可以了解一下，但是我自己试了下，发现效果并不好，new 操作时this指向错了

**通过直接赋值的效果**
```js
Function.prototype.bind = function(that, ...argv) {
  if (typeof this !== 'function') {
    throw new TypeError(`${this} is not callable`);
  }
  // 保存原函数
  let self = this;
  let func = function() {};
  // 获取bind后函数传入的参数
  let bindfunc = function(...arguments) {
    return self.apply(this instanceof func ? this : that, [...argv, ...arguments]);
  };
  // 把this原型上的东西挂载到func原型上面
  // func.prototype = self.prototype;
  // 为了避免func影响到this，通过new 操作符进行复制原型上面的东西
  bindfunc.prototype = self.prototype;

  return bindfunc;
};

function bar() {
  console.log(this.ll);
  console.log([...arguments]);
}
let func3 = bar.bind(null);

func3.prototype.value = 1;

console.log(bar.prototype.value) // 1    可以看到bind后的原型对bind前的原型产生的同样的影响
```
**通过继承赋值的效果**
```js
Function.prototype.bind = function(that, ...argv) {
  if (typeof this !== 'function') {
    throw new TypeError(`${this} is not callable`);
  }
  // 保存原函数
  let self = this;
  let func = function() {};
  // 获取bind后函数传入的参数
  let bindfunc = function(...argu) {
    return self.apply(this instanceof func ? this : that, [...argv, ...argu]);
  };
  // 把this原型上的东西挂载到func原型上面
  func.prototype = self.prototype;
  // 为了避免func影响到this，通过new 操作符进行复制原型上面的东西
  bindfunc.prototype = new func();

  return bindfunc;
};

function bar() {
  console.log(this.ll);
  console.log([...arguments]);
}
let func3 = bar.bind(null);

func3.prototype.value = 1;

console.log(bar.prototype.value) // undefined   可以看到bind后的原型对bind前的原型不产生影响

func3(5);     // seve
              // [ 5 ]
new func3(5); // undefined
              // [ 5 ]
```

以上代码或者表述如有错误或者不严谨的地方，欢迎指出，或者在评论区讨论，觉得我的文章有用的话，可以订阅或者star支持我

下系列文章我打算写关于koa框架的实现，第一篇我会带大家探究Object.create的效果及实现