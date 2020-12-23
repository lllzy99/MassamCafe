<template>
  <div class="bgBlock">
    <div class="bg"></div>
    <div class="bg-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BgBlock'
  }
</script>

<style lang="less" scoped>
  .bgBlock{
    .bg{
      height: 100px;
      background-color: #2bab7b;
    }
    .bg-content{
      margin: 0 10px;
      padding: 10px;
      position: relative;
      top: -20px;
      background-color: #ffffff;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      overflow: hidden;
    }
  }
  
</style>