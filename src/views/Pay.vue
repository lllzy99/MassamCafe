<template>
  <div class="pay">

    <div class="top-nav">
      <van-nav-bar title="提交订单" left-text="返回" left-arrow fixed @click-left="goBack" @click-right="isEdit = !isEdit">
      </van-nav-bar>
    </div>

    <div class="pay-content">
      <div class="address-box">
        <div class="clearfix address-layout" @click="addressSelect">
          <div class="fl address-title">选择收货地址</div>
          <div class="fl arrow-box"><van-icon name="arrow" class="arrow-icon" /></div>
        </div>
        <div class="clearfix address-detail">
          <div class="fl name">{{selectedAddress.name}}</div>
          <div class="fl phone">{{selectedAddress.tel}}</div>
          <div class="fl icon-default"  v-if="selectedAddress.isDefault">默认</div>
        </div>
        <div class="address-info">{{selectedAddress.address}}</div>

      </div>

      <div class="pay-lists">
        <div class="paylist-title">订单信息</div>

        <div class="paylist-info">
          <div class="pro-box" v-for="(item,index) in paylist" :key="index">
            <div class="pro-img fl">
              <img class="auto-img" :src="item.small_img" alt="">
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

        <div class="paylist-bottom">
          <div class="count-box clearfix">
            <div class="count fl">共计{{paylistInfo.count}}件商品</div>
            <div class="total fr">合计 &yen;{{paylistInfo.total | reset}}</div>
          </div>
          <div class="circle left"></div>
          <div class="circle right"></div>
          
        </div>
      </div>

      <div class="pay-button">
        <van-button type="primary" color="#2bab7b" block round @click="payBox">立即结算</van-button>
      </div>

      <!-- 弹出层 -->
      <van-popup class="popoup-box" v-model="isPopup" position="bottom" :closeable="true">
        <div class="popup-title">选择收货地址</div>
        <van-address-list
          v-model="chosenAddressId"
          :list="list"
          default-tag-text="默认"
          @add="onAdd"
          @select="select"
        />

      </van-popup>
    </div>

  </div>
</template>

<script>
  import '../assets/less/pay.less'
  export default {
    name: 'Pay',

    data(){
      return {
        showList:false,

        isPopup: false,

        paylist: [],

        list: [],

        paylistInfo: {
          count: 0,
          total: 0
        },

        selectedAddress:{},

        chosenAddressId: '',

        sids: ''
      }
    },

    created() {
      this.sids = this.$route.query.sids.split('-');

      // 获取提交订单的信息
      this.getCommitInfo();
      // 获取收货地址信息
      this.getDeliveryAddress();
    },

    methods: {
      goBack() {
        this.$router.go(-1);
      },

      // 获取订单信息
      getCommitInfo() {
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
          url: '/commitShopcart',
          params: {
            appkey: this.appkey,
            tokenString,
            sids:JSON.stringify(this.sids)
          }
        }).then(result => {
          this.$toast.clear();
          if(result.data.code == 700) {
            this.$router.push({name: 'Login'});
          }else if(result.data.code == 50000) {
            if(result.data.result.length == 0) {
              this.$router.push({name: 'Shoppingbag'});
            }
          }
          result.data.result.map(v => {
            this.paylistInfo.count += v.count;
            this.paylistInfo.total += v.count*v.price;
          })
          this.paylist = result.data.result;
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      // 选择地址
      addressSelect() {
        this.isPopup = true;
      },

      // 查询收货地址信息
      getDeliveryAddress() {
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
          url: '/findAddress',
          params: {
            appkey: this.appkey,
            tokenString
          }
        }).then(result => {
          this.$toast.clear();
          if(result.data.code == 20000) {
            result.data.result.map(v =>{
              v.isDefault = Boolean(v.isDefault);
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;

              if(v.isDefault) {
                this.chosenAddressId = v.aid;
                this.selectedAddress = v;
              }
            })
            this.list = result.data.result;
            
          }
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      // 新增地址
      onAdd() {
        this.$router.push({name: 'NewAddress'})
      },

      // 选中的收货地址
      select(item) {
        // 隐藏弹出层
        this.isPopup = false;
        this.chosenAddressId = item.aid;
        this.selectedAddress = item;
      },

      // 立即结算
      pay() {
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

        // 请求参数
        let data = {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
          phone: this.selectedAddress.tel,
          address: this.selectedAddress.address,
          receiver: this.selectedAddress.name
        }

        this.axios({
          method: 'POST',
          url: '/pay',
          data
        }).then(result => {
          this.$toast.clear();
          
          if(result.data.code == 60000) {
            this.$toast(result.data.msg);
            setTimeout(() => {
              this.$router.push({name: 'Order'});
            },500);
          }
         
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      // 结算确认弹窗
      payBox() {
        // 判断有没选择地址
        
        if(this.chosenAddressId == ''){
          this.$toast('请选择收货地址');
          return;
        }
        this.$dialog.confirm({
          title: '提交订单',
          message: '是否立即结算？',
          confirmButtonColor: '#2bab7b'
        }).then(v => {
          this.pay();
        }).catch(err => {
          
        })
      }

    }
  }
</script>
