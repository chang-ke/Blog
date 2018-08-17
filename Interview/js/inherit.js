/**
 *
 *
 * @param {function} pro
 * @returns
 */
function inherit(pro) {
  function f() {}
  f.prototype = pro;
  return new f();
}

function new_() {}
/**
 *
 *
 * @param {function} a
 * @param {function} b
 * @returns
 */
function extend(a, b) {
  a.prototype = inherit(b.prototype);
  a.prototype.constructor = a;
  return a;
}

function A() {
  if (!(this instanceof A)) return new A();
  this.data = 1;
}

function B() {
  console.log(12);
}

B.prototype.c = function() {};

console.log(new B(), new extend(A, B)());
