<template>
  <div class="order-list">
    
    <div class="pay-lists">
      <div class="paylist-title">
        <div class="clearfix tab-item-box">
          <div class="fl number">{{payproId}}</div>
          <div class="fr text" v-if="isRight">
            <div class="confirm" v-if="!isReceive" @click="confirmReceive">确认收货</div>
            <div class="toggle-text" v-else>
              <div class="finished">已完成</div>
              <div class="remove" @click="remove">
                <van-icon name="delete" size="18" color="#999" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pro-info">
        <slot></slot>
      </div>

      <div class="paylist-bottom">
        <div class="circle-box">
          <div class="circle fl left"></div>
          <div class="circle fr right"></div>
        </div>
        <div class="date">{{date}}</div>
        <div class="count-box clearfix">
          <div class="count fl">共计{{count}}件商品</div>
          <div class="total fr">合计 &yen;{{total}}</div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
  export default {
    name: 'OrderList',

    props: {
      payproId: {
        type: String,
        default: '订单号'
      },
      isRight: {
        type: Boolean,
        default:true
      },
      date: {
        type: String,
        default: '1970-01-01 00:00:00'
      },
      count: {
        type: Number,
        default: 0
      },
      total: {
        type: [Number,String],
        default: 0
      },
      isReceive: {
        type: Boolean,
        default: false
      }

    },

    methods: {
      // 确认收货 通知父组件处理
      confirmReceive() {
        this.$emit('confirm-receive');
      },

      remove() {
        this.$emit('remove');
      }
    }
  }
</script>

<style lang="less" scoped>
.order-list{
  .pay-lists{
    background-color: #ffffff;
    border-radius: 8px;
    padding: 10px;
  }
  .paylist-title{
    height: 24px;
    font-size: 14px;
    margin-bottom: 10px;
    line-height: 24px;
    .toggle-text{
      display: flex;
    }
    .finished{
      margin-right: 10px;
    }
    .remove{
      margin-top: 3px;
    }
  }

  .paylist-bottom{
    position: relative;
    padding-top: 20px;
    .count-box{
    font-size: 14px;
    font-weight: bold;
      .total{
        color: #2bab7b;
      }
    }
    .circle-box{
      position: absolute;
      left: 0;
      top: -10px;
      width: 100%;
      height: 20px;

    }
    .circle{
      width: 20px;
      height: 20px;
      background-color: #f7f7f7;
      border-radius: 50%;
      position: relative;
      &.left{
        left: -20px;
      }
      &.right{
        right: -20px;
      }
    }
  }
  .date{
    font-size: 14px;
    margin-bottom: 10px;
    color: #666;
  }
}


</style>