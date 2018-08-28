function Animal(name = 'Animal') {
  this.name = name;
  this.sleep = function() {
    console.log(this.name + '正在睡觉！');
  };
}
Animal.prototype.eat = function(food) {
  console.log(this.name + '正在吃：' + food);
};

/**
 * 组合继承
 */
function Cat1(name = 'Tom') {
  Animal.call(this);
  this.name = name;
}

Cat1.prototype = new Animal();

Cat1.prototype.constructor = Cat1;

/**
 * TODO
 */
var cat1 = new Cat1();
console.log(cat1.name);
cat1.sleep();
console.log(cat1 instanceof Animal); // true
console.log(cat1 instanceof Cat1); // true

/**
 * 寄生组合继承
 */

/**
 * 组合继承
 */
function Cat2(name) {
  Animal.call(this);
  this.name = name || 'Tom';
}

Cat2.prototype = Object.create(Animal.prototype); //对比new Animal()可少调用一次构造函数

/**
 * Object.create等价于
 * function (o){
 *   function F(){};
 *   F.prototype = o;
 *   return new F();
 * }
 */

Cat2.prototype.constructor = Cat2;

/**
 * TODO
 */
var cat2 = new Cat2('jeck');
console.log(cat2.name);
cat2.sleep();
console.log(cat2 instanceof Animal); // true
console.log(cat2 instanceof Cat2); // true
