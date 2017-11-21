# musicapp
<<<<<<< HEAD

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
技术栈： vue2.0+axios
数据来源：
音乐数据是从qq音乐上抓取的,通过jsonp来解决跨域问题，
有些音乐数据有来源限制解决方式是通过编写nodejs
![Alt text](https://github.com/smaRookie/musicapp/raw/master/rim/1.png)
大体内容：

![Alt text](https://github.com/smaRookie/musicapp/raw/master/rim/2.png)
![Alt text](https://github.com/smaRookie/musicapp/raw/master/rim/3.png)
![Alt text](https://github.com/smaRookie/musicapp/raw/master/rim/4.png)
![Alt text](https://github.com/smaRookie/musicapp/raw/master/rim/5.png)
![Alt text](https://github.com/smaRookie/musicapp/raw/master/rim/6.png)
![Alt text](https://github.com/smaRookie/musicapp/raw/master/rim/7.png)
![Alt text](https://github.com/smaRookie/musicapp/raw/master/rim/8.png)
![Alt text](https://github.com/smaRookie/musicapp/raw/master/rim/9.png)
![Alt text](https://github.com/smaRookie/musicapp/raw/master/rim/10.png)
![Alt text](https://github.com/smaRookie/musicapp/raw/master/rim/11.png)
![Alt text](https://github.com/smaRookie/musicapp/raw/master/rim/12.png)
![Alt text](https://github.com/smaRookie/musicapp/raw/master/rim/13.png)
主要功能:
1.轮播图片 热门歌单推荐
2.歌手栏
3.最近热门排行榜音乐
4.搜索栏
5.个人信息
页面的大体布局采用flex布局在各个型号有较好的适配
在解决跨域问题采用了第三方jsonP库自己进行了封装,封装成promise对象
![Alt text](https://github.com/smaRookie/musicapp/raw/master/rim/14.png)
实现了加载图片
![Alt text](https://github.com/smaRookie/musicapp/raw/master/rim/15.png)
下拉刷新：通过监听scroll到距离底部50px是派发出事件父组件再从接口中获取数据
![Alt text](https://github.com/smaRookie/musicapp/raw/master/rim/16.png)


