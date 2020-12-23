<template>
    <div class="proItem-box">
      <div class="pro-img">
        <img class="auto-img" :src="item.smallImg">
      </div>
      <div class="pro-info">
        <div class="pro-name nowrap">{{item.name}}</div>
        <div class="pro-enname nowrap">{{item.enname}}</div>
        <div class="pro-price">&yen;{{item.price}}</div>
      </div>
    </div>   
</template>

<script>
  export default {
    name:'ProductItem',

    props: {
      item: {
        type: Object,
        default(){
          return{};
        } 
      }
    },

  }
</script>

<style lang="less" scoped>

.proItem-box{
  .pro-img{
    width: 100%;
  }
  .pro-info{
    background-color: #fff;
    padding: 5px 10px;
    .pro-name{
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .pro-enname{
      font-size: 12px;
      color: #a0a0a0;
      margin-bottom: 5px;
    }
    .pro-price{
      font-weight: bold;
      color: #2bab7b;
    }
  }
}
</style>