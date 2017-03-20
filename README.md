# audioDemo
音频自定义播放+计时、+调节进度、++++
# 遇到的问题

## 1、安卓4.0-4.4 touchmove问题
在Android下直接使用touchmove事件会在很多浏览器中出现每次操作只触发一次touchmove的情况。这是因为Android中对触屏事件奇葩解析造成的，在touchmove触发的瞬间就触发了touchcancel，后续事件就不执行了，所以要在touchmove或者touchstart事件触发的时候禁止它的默认行为。
(PS：如果touchmove监听是含有滚动事件的，event.preventDefault()在touchstar取消默认行为会导致滚动事件也被取消，解决办法暂时是监控4.0-4.4版本下模拟滚动)
## 2、aac出现手机不支持等情况，自带播放器不支持格式，导致获取 audio.currentTime 的永远处于0
## 3、vivio等手机出现获取 audio.duration 时一开始会先得到一个100或者0的数值之后才得到正确的时间值
## WTF 客户端开启debug模式的vivo手机 加载audio时候会闪退~
