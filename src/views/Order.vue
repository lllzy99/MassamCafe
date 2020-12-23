<template>
  <div class="order">
    <div class="top-nav">
      <van-nav-bar title="我的订单" left-text="返回" left-arrow fixed @click-left="goBack" @click-right="isEdit = !isEdit">
      </van-nav-bar>

      <BgBlock>

        <div class="navbar-content" v-if="isHas">
          <van-tabs v-model="activeTab" color="#2bab7b" line-height="2px" title-active-color="#2bab7b" @change="changeTab">
            <van-tab :title="value.title" v-for="(value,k) in tabData" :key="k">
              <!-- 有对应的订单 -->
              <div v-if="orderData.length > 0">
                <div class="tab-item" v-for="(item,index) in orderData" :key="index">
                  
                  <OrderList 
                    :paypro-id="item.oid"
                    :is-right="true" 
                    :date="item.date | formatDate('yyyy-MM-dd hh:mm:ss')" 
                    :count="item.count" 
                    :total="item.total | reset" 
                    :is-receive="item.status == 2" 
                    @confirm-receive="confirmReceive(item,index)" 
                    @remove="remove(item.oid,index)">
                    <OrderItem v-for="(v,i) in item.data" :key="i" :item=v></OrderItem>
                  </OrderList>

                </div>
              </div>
              <!-- 无对应的订单 -->
              <div v-else>
                <van-empty description="没有订单数据" />
              </div>
            </van-tab>
          </van-tabs>
        </div>

        <div v-else>
          <van-empty description="没有订单数据" />
        </div>

      </BgBlock>
    </div>    
  </div>
</template>

<script>
  import BgBlock from '../components/BgBlock.vue'
  import '../assets/less/order.less'
  import OrderItem from '../components/OrderItem'
  import OrderList from '../components/OrderList'

  export default {
    name: "Order",

    components: {
      BgBlock,
      OrderList,
      OrderItem
    },

    data() {
      return {
        activeTab: 0,

        tabData: [
          {title: '全部'},
          {title: '进行中'},
          {title: '已完成'}
        ],

        orderData: [],

        isHas: true
      }
    },

    created() {
      // 查询订单信息
      this.findOrderInfo(); 
    },

    methods: {
      goBack() {
        this.$router.go(-1);
      },

      changeTab(name,title) {
        this.findOrderInfo();
      },

      // 根据订单状态来查询订单
      findOrderInfo() {
        let tokenString = localStorage.getItem('tokenString');
        // 验证token的值
        if(!tokenString){
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }
        // 加载图标
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method: 'GET',
          url: '/findOrder',
          params: {
            appkey: this.appkey,
            tokenString,
            // 根据状态筛选数据
            status: this.activeTab
          }
        }).then(result => {
          this.$toast.clear();
          // 700 token无效
          if(result.data.code == 70000) {
            // 没有订单数据
            if(this.activeTab == 0 && result.data.result.length == 0) {
              this.isHas = false;
              return;
            }
          
          // 根据订单编号oid构造数据
          let orderDatas = [];
          result.data.result.map(v =>{
           for(let i=0; i<orderDatas.length; i++){
             if(orderDatas[i].oid == v.oid){
                // 存在oid 数据则累加
                orderDatas[i].data.push(v);
                orderDatas[i].count += v.count;
                orderDatas[i].total += v.count*v.price;
                return;
              }
            }
            let o = {};
            o.oid = v.oid;
            o.count = v.count;
            o.total = v.count*v.price;
            o.status = v.status;
            o.date = v.createdAt;
            o.data = [v];
            // 订单最新的排在前面
            orderDatas.unshift(o);
          })
          this.orderData = orderDatas;
          // 
          }
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      // 确认收货
      confirmReceive(item,index) {
        let tokenString = localStorage.getItem('tokenString');
        if(!tokenString){
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method: 'POST',
          url: '/receive',
          data: {
            appkey: this.appkey,
            tokenString,
            oid: item.oid
          }
        }).then(result => {
          this.$toast.clear();
          if(result.data.code == 700) {
            this.$router.push({name: 'Login'});
          }else if(result.data.code == 80000){
            if(this.activeTab == 1) {
              this.orderData.splice(index,1);
            }
            item.status = 2;
          }
          this.$toast(result.data.msg);
        }).catch(err => {
          this.$toast.clear();
          
        })
      
      },

      // 删除订单
      remove(oid,index) {
        
        let tokenString = localStorage.getItem('tokenString');
        if(!tokenString){
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }
        // 加载图标
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method: 'POST',
          url: '/removeOrder',
          data: {
            appkey: this.appkey,
            tokenString,
            oid
          }
        }).then(result => {
          this.$toast.clear();
          if(result.data.code == 700) {
            this.$router.push({name: 'Login'});
          }else if(result.data.code == 90000){
            this.orderData.splice(index,1);
          }
          this.$toast(result.data.msg);
        }).catch(err => {
          this.$toast.clear();
          
        })
      }

    }
  }
</script>
