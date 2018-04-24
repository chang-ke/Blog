> 解决 canvas 将图片转为 base64 报错: Uncaught DOMException: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported

受限于 CORS 策略，会存在跨域问题，虽然可以使用图像（比如 append 到页面上）但是绘制到画布上会污染画布，一旦一个画布被污染,就无法提取画布的数据，比如无法使用使用画布 toBlob(),toDataURL(),或 getImageData()方法;当使用这些方法的时候 会抛出一个安全错误

```
img.setAttribute("crossOrigin",'Anonymous')
```
