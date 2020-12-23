<template>
  <div class="order-item">

    <div class="paylist-info">
      <div class="pro-box">
        <div class="pro-img fl">
          <img class="auto-img" :src="item.smallImg">
          <!-- item.small_img -->
        </div>
        <div class="pro-info fl">
          <div class="pro-text">
            <div class="name-box">{{item.name}}<span class="rule-box">{{item.rule}}</span></div>
            <div class="enname-box">{{item.enname}}</div>
          </div>
          <div class="pro-count clearfix">
            <div class="price-box fl">&yen;{{item.price}}</div>
            <div class="count-num fr">x{{item.count}}</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'OrderItem',

    props: {
      item: {
        type: Object,
        default() {
          return {
            name: '商品名称',
            rule: '规格',
            enname: '英文名称',
            price: '价格',
            count: '数量'
          };
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.paylist-info{
  padding-bottom: 10px;
  border-bottom: 1px dashed #ccc;
  .pro-box{
    height: 80px;
    margin-bottom: 10px;
    .pro-img{
      width: 80px;
      height: 80px;
      background-color: #ccc;
    }

    .pro-info{
      width: calc(~"100% - 90px");
      height: 80px;
      margin-left: 10px;
      box-sizing: border-box;
      .pro-text{
        margin-top: 5px;
        .name-box{
          font-size: 16px;
          margin-bottom: 5px;
        }
        .rule-box{
          font-size: 12px;
          color: #999;
          margin-left: 10px;
        }
        .enname-box{
          font-size: 12px;
          color: #999;
        }
      }
      .pro-count{
        padding-top: 8px;
        .price-box{
          color: #2bab7b;
          font-weight: bold;
          margin-top: 4px;
        }
        .count-num{
          font-size: 14px;
          margin-top: 4px;
          color: #999;
        }
      }
    }
  }
}

</style>