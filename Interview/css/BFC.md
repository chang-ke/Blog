#### BFC 全称为 block formatting context, 中文一般译作“块级格式化上下文”

什么时候会触发 BFC 呢？常见情况如下：

- html 根元素

- float 的值不为 none

- overflow 的值为 auto、scroll 和 hidden

- display 的值为 table-cell、table-caption 和 inline-block 中的任何一个

- position 的值不为 relative 和 static

以上参考自张鑫旭大神的<CSS 世界>

BFC 的表现原则
