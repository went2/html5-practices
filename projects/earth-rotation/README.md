## 说明

实现一个地球绕太阳转的动画效果，如图：

![earth-roration-effect](./images/earth-roration-effect.gif)

### 实现思路

如下图：

![earth-roration-explanation](./images/earth-roration-explanation.gif)

把地球放到一个地球轨道容器的边上，然后让轨道容器绕中心旋转。

### 遇到问题

按这个思路，实现月球绕地球转，是把月球放到月球轨道容器，然后让容器旋转，这里的问题是地球 `div` 也在月球轨道内，所以地球会和月球一起转，期望实现的效果是，地球相对静止。

解决方式是，单独为地球 `div`，添加一个反方向旋转的动画，来抵消月球轨道带动的旋转。

```css
// 月球轨道容器，绕中心旋转效果
.moon_orbit {
  animation: circle 20s linear infinite;
}

@keyframes circle {
  100% {
    transform: rotate(360deg);
  }
}

// 地球图片反方向旋转以抵消容器的正向旋转
.earth img {
  width: 80px;
  border-radius: 50%;
  animation: circle-reverse 20s linear infinite;
}

@keyframes circle-reverse {
  100% {
    transform: rotate(-720deg);
  }
}
```

有个问题不明白，正向旋转设置的是 `rotate(360deg);`，但反向旋转的动画要设置 `rotate(-720deg)` 才能完全抵消正向旋转效果，如果设置 `rotate(-360deg)`，还是会被容器带着作微弱旋转，猜测和旋转半径有关。轨道半径长，地球图片半径短，相同时间，半径短的要旋转更多的角度才能抵消半径长的。