
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
func3 = bar.bind(null);

func3.prototype.value = 1;

console.log(bar.prototype.value) // undefined   可以看到bind后的原型对bind前的原型不产生影响

func3(5);     // seve
              // [ 5 ]
new func3(5); // undefined
              // [ 5 ]
