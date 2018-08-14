function inherit(func, pro) {
  func.prototype = pro.prototype;
  func.prototype.constructor = func;
  return func;
}

function A() {
  if (!(this instanceof A)) return new A();
  this.data = 1;
}

function B() {
  console.log(12);
}

B.prototype.c = function() {};

inherit(A, B);
console.log(new A());
