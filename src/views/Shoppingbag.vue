<template>
  <div class="shoppingbag">
    <div class="top-nav">
      <van-nav-bar title="购物袋" left-text="返回" right-text="编辑" left-arrow fixed @click-left="goBack" @click-right="isEdit = !isEdit">
      <template #right>
        <div v-if="shoppingBagData.length> 0">{{isEdit ? '完成' : '编辑'}}</div>
      </template>
      </van-nav-bar>
    </div>

    <div class="shop-empty" v-if="shoppingBagData.length==0">
      <van-empty description="购物车啥也没有~">
        <van-button round type="default" class="bottom-button" @click="goHome">
          去看看
        </van-button>
      </van-empty>
    </div>

    <div v-else class="shopping-content">
      <div class="shop-bg">
        <img class="auto-img" src="../assets/images/bg1.jpg">
      </div>
      
      <!-- 滚动加载 -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了~" offset="10" @load="onLoad">

        <div class="shop-pro">

          <div class="shop-pro-item" v-for="(item,index) in shoppingBagData" :key="index">
            <van-swipe-cell :disabled="!isEdit">
              <!-- 左边复选框 -->
              <div class="pro-check fl">
                <van-checkbox v-model="item.isChecked" @change="singleCheck"></van-checkbox>
              </div>
              <!-- 右边内容 -->
              <div class="pro-box">
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
                    <div class="step-box fr">
                      <van-stepper theme="round" v-model="item.count" button-size="22" disable-input @change="changeCount(item.sid,item.count)" />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 滑动删除 -->
              <template #right>
                <van-button square color="#d52b2b" text="删除" @click="removeSingle(index,item.sid)"/>
              </template>
            </van-swipe-cell>
          </div>
        
        </div>

      </van-list>

      <van-submit-bar v-if="!isEdit" :price=total button-text="提交订单" button-color="#2bab7b"  @submit="commit">
        <van-checkbox v-model="isAllChecked" @click="allCheck">全选</van-checkbox>
      </van-submit-bar>

      <van-submit-bar class="del-btn" v-else button-text="删除选择" @submit="removeSelect" >
        <van-checkbox v-model="isAllChecked" @click="allCheck">全选</van-checkbox>
      </van-submit-bar>
      
    </div>
  </div>
</template>

<script>
import '../assets/less/shoppingbag.less'
export default {
  name: "Shoppingbag",

  data() {
    return {
      isEdit: false,
      isAllChecked: false,
      total: 0,
      loading:true,
      finished: false,
      startIndex: 0,
      dataCount: 6,
      allShopData: [],
      shoppingBagData: []
    };
  },
  created() {
    this.getShoppingBagInfo();
  },

  methods: {

    goBack() {
      // this.$router.push({name: 'Home'});
      if(this.shoppingBagData.length == 0){
      this.$router.push({name: 'Home'});
    }else{
      this.$router.go(-1)
    }
    },

    goHome() {
      this.$router.push({name:'Home'});
    },

    getShoppingBagInfo() {
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
          url: '/findAllShopcart',
          params: {
            appkey: this.appkey,
            tokenString
          }
        }).then(result => {
          // 
          this.$toast.clear();
          if(result.data.code == 5000) {
            // 添加属性
            result.data.result.map(v => {
              v.isChecked = false;
            })
            this.allShopData = result.data.result;
            // 开始时 购物袋展示的数据
            this.shoppingBagData = this.allShopData.slice(this.startIndex,this.startIndex+this.dataCount);
            this.startIndex = this.startIndex + this.dataCount;
            this.loading = false;
          }
        }).catch(err => {
          this.$toast.clear();
          
        })
    },

    // 懒加载
    onLoad() {
      setTimeout(() => {
        let data = this.allShopData.slice(
        this.startIndex,
        this.startIndex+this.dataCount);

        this.startIndex += this.dataCount;

        this.shoppingBagData.push(...data);

        // 剩余数据不足时
        if(data.length < this.dataCount) {
          this.finished = true;
        }else {
          this.loading = false;
        }

      },1500)
      
    },

    // 全选
    allCheck() {
      this.shoppingBagData.map(v => {
        v.isChecked = this.isAllChecked;
      })
      this.getSum();
    },

    // 单选
    singleCheck() {
      this.getSum();
      for(let i=0; i<this.shoppingBagData.length; i++){
        if(!this.shoppingBagData[i].isChecked){
          this.isAllChecked = false;
          return;
        }
      }
      this.isAllChecked = true;
    },

    // 改变数量
    changeCount(sid,count) {
      let tokenString = localStorage.getItem('tokenString');
        // 验证token的值
        if(!tokenString){
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }

        this.axios({
          method: 'POST',
          url: '/modifyShopcartCount',
          data: {
            appkey: this.appkey,
            tokenString,
            sid,
            count
          }
        }).then(result => {
          
          if(result.data.code == 6000) {
            // 如果有被选中的 重新计算总额
            this.shoppingBagData.map(v => {
              if(v.isChecked) {
                this.getSum();
              }
            })
          }
        }).catch(err => {
        })
    },

    // 是否有商品被选中
    isSelectHas() {
      for(let i=0; i<this.shoppingBagData.length; i++) {
        if(this.shoppingBagData[i].isChecked) {
          return true;
        }
      }
      return false;
    },

    // 获取选中商品的sid结合
    getSids() {
      let sids = [];
      this.shoppingBagData.map(v => {
        if(v.isChecked) {
          sids.push(v.sid);
        }
      })
      return sids;
    },

    // 单个(滑动)删除
    removeSingle(index,sid) {
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
        method: 'POST',
        url: '/deleteShopcart',
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify([sid])
        }
      }).then(result => {
        
        this.$toast.clear();
        if(result.data.code == 7000) {
          this.shoppingBagData.splice(index,1);
          this.getSum();
        }
        this.$toast(result.data.msg);

      }).catch(err => {
        this.$toast.clear();
        
      })
    },

    // 删除选择
    removeSelect() {
      // 是否有选中的商品
      let isHas = this.isSelectHas();
      if(!isHas) {
        this.$toast('请选择需要删除的商品');
        return;
      }

      let tokenString = localStorage.getItem('tokenString');
      // 验证token的值
      if(!tokenString){
        this.$toast('请先登录');
        return this.$router.push({name: 'Login'});
      }

      let sids = this.getSids();
      
      // 加载图标
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })

      this.axios({
        method: 'POST',
        url: '/deleteShopcart',
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids)
        }
      }).then(result => {
        
        this.$toast.clear();
        if(result.data.code == 7000) {
          for(let i=0; i<this.shoppingBagData.length; i++) {
            if(this.shoppingBagData[i].isChecked) {
              this.shoppingBagData.splice(i,1);
              i--;
            }
          }
          this.getSum();
        }
        this.$toast(result.data.msg);

      }).catch(err => {
        this.$toast.clear();
        
      })


      
    },

    // 统计总金额
    getSum() {
      this.total = 0;
      this.shoppingBagData.map(v => {
        if(v.isChecked) {
          this.total += v.count * v.price;
        }
      })
      this.total *= 100;
    },

    // 提交订单
    commit() {
      let isHas = this.isSelectHas();
      if(!isHas) {
        this.$toast('请选择需要购买的商品');
        return;
      }

      let sids = this.getSids();

      // 携带参数跳转订单页面
      this.$router.push({name: 'Pay',query: {sids: sids.join('-'),totalMoney: this.total}});
    }

  }
};
</script>

