<template>

  <div id="app">
    <router-view/>
  </div>

</template>

<style lang="less">
// 全局样式
body{
  background-color: #f7f7f7;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  color: #4c4c4c;
}
.auto-img {
  width: 100%;
  display: block;
}
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
