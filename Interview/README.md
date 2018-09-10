### 说明：这里面试题都是我收集各位大佬们面经里面出现次数较多且比较典型的题目

#### JS 部分

- [x] [继承，原型链和构造函数，组合构造函数，寄生组合构造函数](./js/inherit.ts)

- [x] js 基本数据类型

  > Number, String, Null, Undefined, Boolean, Symbol 存放在栈中

  > 复杂数据类型 Object，Array，Function 则属于引用类型，存放在堆中

- [x] 如何判断 js 数据类型

  > Object.prototype.toString.call

  - object => [object Obejct]

  - array => [object Array]

  - number => [object Number]

  - string => [object String]

  - function => [object Function]

  - symbol => [object Symbol]

  - null => [object Null]

  - undefined => [object Undefined]

- [ ] js 作用域
- [ ] js 继承
- [ ] js 原型链
- [x] [ES6 常用方法](./js/es6.md)

- [ ] 浏览器缓存机制

- [x] [从输入一个 url 到显示页面？](https://dailc.github.io/2018/03/12/whenyouenteraurl.html)参考这篇博文，很全
- [x] [重排和重绘](./js/RepaintAndReflow.md)

- [ ] react 与 vue
- [ ] redux

- [ ] xss csrf

- [x] vw vh 1vw 等于多少

  > vw 视窗宽度的百分比
  > vh 视窗高度的百分比
  > 1vw 等于视窗宽度的 1%
  > 兼容性：移动端 Android 4.4 和 iOS8 及以上，PC 端 IE10 及以上支持

- [ ] sessionStorage 和 localStorage 的区别
      如果关闭一个标签页 它的 sessionStorage 还有吗 那它什么时候清除

- [ ] 前端性能优化的方案
      首屏加载怎么优化

- [x] 有个应用场景，你在淘宝登录之后请求到天猫页面（不同子域），登录状态是保留的，如何实现的
  > 将登录状态保存在 cookie，并将 domain 设置为顶级域名
- [x] 箭头函数和普通函数的区别

  > 箭头函数 没有 this，arguments，super，也没有原型，不能被 new 调用，自动绑定父级作用域的 this

- [x] 哪些方法会改变原数组

  > shift(删除第一个) unshift(往开头添加) pop(删除最后一个) push(往末尾添加) reverse(反转) sort(排序) splice(删，改，替换)

- [x] 深拷贝和浅拷贝

  > 浅拷贝只复制第一层，...和 Object.assgin 均可实现，深拷贝需要递归拷贝每一项

- [ ] call，apply，bind 的区别，作用

- [x] 知道事件代理吗，为什么使用事件代理，target 和 currenttarget

  > 提高性能, 动态绑定
  > currentTarget 是指绑定事件的对象， target 是指触发该事件的对象
  > 比如说你在 ul 上绑定点击事件，当子元素 li 被点击时，由于事件冒泡，会触发 ul 的点击事件
  > 于是 currentTarget 是 ul， target 是 li

- [x] [实现图片懒加载](./js/lazy-load.html)

  > 我实现时使用了简陋的节流函数，如果线上使用可以用 loadash 等库里面的

- [x] [正则匹配一个邮箱 以及 匹配 http://www.sohu.com/ 中的主域名（?=即可）](./js/regx.js)
- [x] [正则表达式（字符串格式成金额（欧美，三个，）的）？](./js/regx.js)
- [ ] 设计模式
  > 推荐 JavaScript 设计模式和开发实践
  > 能够手写常见的单例模式，发布订阅模式（观察者模式），工厂模式等等
- [x] [微信群里见的一个阿里面试题，要求使用纯函数式方法计算 1000 以内能被 7 整除的所有奇数平方和。用 Promise 实现异步流式操作方法，比如方法 flow([a, b])就执行 a，再执行 b；比如 flow[a, [b, c], d]就执行 a,，同时执行 b, c，再执行 d，嵌套数组则定义为并行操作，嵌套只有一层](./js/flow.js)
- [x] 进程和线程的区别

  - 线程是最小的执行单元，进程是最小的资源管理单元
  - 一个线程只能属于一个进程，而一个进程可以有多个线程，且至少有一个

- [ ] 闭包
  > 闭包可以实现私有变量，但如果使用不当容易造成内存泄漏，所以一般使用完后需要切断变量的引用
- [ ] 跨域及其解决方案

- [ ] get post 区别

- [x] 模块方面，ES6 和 CommonJS

  > CommonJS 输出的是值的拷贝，ES6 是值的引用
  > CommonJS 是运行时加载，而 ES6 是编译时确定的
  > import React from 'React'，React 是只读的

- [x] 模块加载 AMD，CMD， CommonJS
  > 对于依赖的模块，AMD 是提前执行，而 CMD 是延迟执行
  > CMD 推崇依赖就近，AMD 推崇依赖前置
- [x] [封装 cookie](./js/cookie.js)

- [ ] [Event Loop](./js/eventloop.md)

- [ ] DOM 事件模型了解吗？了解的话知道 addEventListener 第三个参数作用是什么吗？

- [ ] 防抖和节流

- [x] [减层数组](./js/flatten.ts)

```js
list: [1, 2, [3, 4], [5, 6, [7, 8], 9], 10, 11]

depth = 1: [1, 2, 3, 4, 5, 6, [7, 8], 9, 10, 11]

depth = 2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

...

function flatten (list, depth) {}
```

#### CSS 部分

- [ ] margin 塌陷问题（BFC）
- [x] [css 做一个进度条动画，进度条左右是带弧形的](./css/loading.html)

- [ ] css 菱形

- [ ] flex 布局

- [x] [实现 4：3 的 div](./css/4-3div.html)
  > padding-top 的百分比是相对于父元素宽度计算，所以可以把子元素的 padding-top 设置为 75%，高度设置为 0 即可。
- [ ] css 定位 圣杯布局

- [ ] css 选择器，选择器优先级

#### 工具部分

- [ ] webpack 配置怎么写？
- [ ] webpack 的优化方式 用途
      如果有 10 个 js 只用到了 1 个 怎么打包优化(参照 rollup 的 treeshaking)
- [x] git merge 和 git merge --no-ff
  > git merge –no-ff 可以保存你之前的分支历史。能够更好的查看 merge 历史，以及 branch 状态。
  > git merge 则不会显示 feature，只保留单条分支记录。

#### 计算机网络 部分

- [ ] http 缓存 etag
      etag 怎么随机生成

- [ ] http 协议
- [ ] http 状态码
- [ ] http https 区别 https 具体解决了哪些问题？举个栗子？
- [ ] tcp/udp 区别, tcp 为什么可以实现可靠传输
- [ ] tcp 三次握手
- [ ] websocket

#### 算法部分

- [x] [判断是否存在循环引用](./algorithm/validate.ts)

- [x] [从 1-n（自然序列）中选出一个数，然后打乱数组，找出这个缺失的数（求和）](./algorthm/findNum.ts)

- [x] [bfs 和 dfs](./algorithm/dfs_bfs.js)

- [x] [快排（几乎必问）](../Algorithms/quickSort/QuickSort.cpp)

  > 不稳定算法，时间复杂度 O(n \* logn)

- [x] [一个函数，输入两个字符串，看两个字符串是不是切一刀反转的，是返回 true，不是返回 false，如 12345 和 34512 是 true](./algorithm/strJudge.ts)

- [x] [a^n 怎么用小于 O(n) 的算法实现 ( 快速幂算法 )](./algorithm/quickPow.ts)
  > 时间复杂度 O(logn)
- [x] [大数加法](./algorithm/bigNumber.ts)

  > 同时我也实现了乘法

- [x] [Top K 算法](./algorithm/topk.ts)
  > 时间复杂度 O(n \* logm)为优
- [x] [二叉树遍历(递归非递归实现？)]()

- [x] [KMP 算法](../Algorithms/KMP.cpp)

- [x] [单链表反转](../Algorithms/reverse/main.cpp)

- [x] [两个有序数组，合并成一个有序数组？例如把这两个数组[1,3,5,7,9],[2,4,6,8,10]合并成[1,2,3,4,5,6,7,8,9,10]](./js/merge.ts)

- [x] [[1,2,[3,4],[5,6],{a: 7}] 变成[1,2,3,4,5,6,7] 和上面一样，会嵌套很多层](./js/flatten.ts)
