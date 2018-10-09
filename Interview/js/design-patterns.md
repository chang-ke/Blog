### 单例模式

```js
const User = (function() {
  let instance = null;
  function User() {
    console.log('User initialize');
  }
  return function() {
    if (instance === null) return (instance = new User());
    return instance;
  };
})();
```

### AOP

```js
Function.prototype.before = function(fn) {
  const self = this;
  return function(...argvs) {
    fn.apply(this, argvs);
    self.apply(this, argvs);
  };
};

Function.prototype.after = function(fn) {
  const self = this;
  return function(...argvs) {
    self.apply(this, argvs);
    fn.apply(this, argvs);
  };
};

let func = function() {
  console.log(2);
}
  .before(function() {
    console.log(1);
  })
  .after(function() {
    console.log(3);
  });
func();
```
