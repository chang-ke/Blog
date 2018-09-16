css 绘制菱形，三角形，平行四边形，梯形主要理解下图的盒子模型

![](./shape.png)

在这里多说一句，inline-block 元素如果是相邻的话，会有间隙，解决办法如下

1、父元素设置 fontsize 为 0

```css
font-size: 0;
```

2、去掉 html 中的空白字符

3、利用负 margin 去除（不推荐使用）
