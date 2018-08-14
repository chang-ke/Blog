### 说明：这里面试题都是我收集各位大佬们面经里面出现次数较多且比较典型的题目

#### js 部分

- [ ] 继承，原型链和构造函数，组合构造函数，寄生组合构造函数，代码实现

- [ ] js 基本数据类型
- [ ] 如何判断 js 数据类型

- [ ] js 作用域
- [ ] js 继承
- [ ] js 原型链
- [x] [ES6](./js/7.md)

- [ ] 浏览器缓存机制

- [ ] 从输入一个 url 到显示页面？
- [ ] 重排和重绘

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
- [ ] 箭头函数和普通函数

- [ ] 哪些方法会改变原数组

  > slice, splice 方法都可以对数组进行切割，且都返回切割的内容，唯一不同的是 splice 会改变原来的数组，此外 slice 也适用于对字符串进行操作

- [ ] 深拷贝和浅拷贝

  > 浅拷贝只复制第一层，...和 Object.assgin 均可实现，深拷贝需要递归拷贝每一项

- [ ] call，apply，bind 的区别，作用

- [ ] 知道事件代理吗，为什么使用事件代理，target 和 currenttarget

  > 提高性能
  > target 是指绑定事件的对象，currentTarget 是指触发该事件的对象
  > 比如说你在 ul 上绑定点击事件，当子元素 li 被点击时，由于事件冒泡，会触发 ul 的点击事件
  > 于是 target 是 ul，currentTarget 是 li

- [x] [实现图片懒加载](./js/lazy-load.html)

- [ ] 正则匹配一个邮箱 以及 匹配http://www.sohu.com/ 中的主域名（?=即可）
- [ ] 正则表达式（字符串格式成金额（欧美，三个，）的）？
- [ ] 设计模式
- [x] [群里见的一个阿里面试题，要求使用纯函数式方法计算 1000 以内能被 7 整除的所有奇数平方和 用 Promise 实现异步流式操作方法，比如方法 flow([a, b])就执行 a，再执行 b；比如 flow[a, [b, c], d]就执行 a,，同时执行 b, c，再执行 d，嵌套数组则定义为并行操作，嵌套只有一层](./js/flow.js)

#### CSS 部分

- [ ] margin 塌陷问题（BFC）
- [ ] css 做一个进度条动画，进度条左右是带弧形的（不会）

- [ ] css 菱形，translate 的矩阵是怎么算的（没答好）

- [ ] flex 布局

- [x] 实现 4：3 的 div
  > padding-top 的百分比是相对于父元素宽度计算，所以可以把子元素的 padding-top 设置为 75%，高度设置为 0 即可。
- [ ] (补充 css 部分   css 定位 圣杯布局。。)

#### 工具部分

- [ ] webpack 配置怎么写？
- [ ] webpack 的优化方式 用途
      如果有 10 个 js 只用到了 1 个 怎么打包优化(参照 rollup 的 treeshaking)
- [x] git merge 和 git merge --no-ff
  > git merge –no-ff 可以保存你之前的分支历史。能够更好的查看 merge 历史，以及 branch 状态。
  > git merge 则不会显示 feature，只保留单条分支记录。

#### HTTP 部分

- [ ] http 缓存 etag
      etag 怎么随机生成

- [ ] http 协议
- [ ] http 状态码
- [ ] http https 区别 https 具体解决了哪些问题？举个栗子？
- [ ] tcp/udp 区别
- [ ] tcp 三次握手

#### 算法部分

- [x] [判断是否存在循环引用](./algorithm/validate.js)

- [ ] 从 1-n（自然序列）中选出一个数，然后打乱数组，找出这个缺失的数（求和）

- [x] [bfs 和 dfs](./algorithm/dfs_bfs.js)

- [ ] 快排（几乎必问）

- [x] [一个函数，输入两个字符串，看两个字符串是不是切一刀反转的，是返回 true，不是返回 false，如 12345 和 34512 是 true](./algorithm/5.js)

- [x] [a^n 怎么用小于 O(n) 的算法实现 ( 快速幂算法 )](./algorithm/quickPow.js)

- [x] [大数加法](./algorithm/bigNumber.js)

- [x] [Top K 算法](./algorithm/topk.js)