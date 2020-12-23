<template>
  <div class="detail">
    <!-- 顶部导航 -->
    <div class="detail-nav">
      <van-nav-bar title="商品详情" left-text="返回" left-arrow fixed @click-left="goBack"/>
    </div>

    <!-- 商品图片 -->
    <div class="current-pro-img">
      <img :src="currentProData.large_img" class="auto-img">
    </div>

    <!-- 商品标题信息 -->
    <div class="current-title-box">
      <div class="current-text">
        <div class="current-title">{{currentProData.name}}
          <!-- <div class="current-enname">{{currentProData.enname}}</div> -->
        </div>
        
      </div>
    </div>

    <!-- 商品详情 -->
    <div class="current-pro-detail">

      <div class="current-count clearfix">
        <div class="count-text fl">&yen;{{proInfo.count*currentProData.price | reset}}</div>
        <div class="count-box fr">
        <van-stepper v-model="proInfo.count" theme="round" button-size="22" disable-input />
        </div>
      </div>

      <div class="rule-box">
        <div class="rule-item" v-for="(item,index) in currentProData.rules" :key="index" >
          <div class="rule-t">{{item.title}}</div>
          <div class="rule-detail">
            <div class="rule-item" v-for="(v,i) in item.rule" :key="i" :class="{active: item.activeIndex==i}" @click="toggleRule(item,i)">{{v.title}}</div>
          </div>
        </div>
      </div>

      <div class="current-desc">
        <div class="desc-title">商品描述</div>
        <div class="desc-item" v-for="(item,index) in currentProData.desc" :key="index">{{index+1}}、{{item}}</div>
      </div>
    </div>

    <div class="detail-bottom">
      <van-goods-action>
        <van-goods-action-icon :to="{name: 'Shoppingbag'}" :icon="proCount>0 ? 'bag' : 'bag-o'" :color="proCount>0 ? '#2bab7b' : '#333'" text="购物袋" :badge="proCount==0 ? '' : proCount" />
        <van-goods-action-icon :icon="isLike ? 'like':'like-o'" :color="isLike ? '#2bab7b' : '#333'" text="收藏" @click="toggleLikePro" />
        <van-goods-action-button color="#9dd2bc" text="加入购物袋" @click="addShopBag()" />
        <van-goods-action-button color="#2bab7b" type="danger" text="立即购买" @click="buyNow(true)" />
      </van-goods-action>

    </div>

  </div>
</template>

<script>
  import '../assets/less/detail.less'
  export default {
    name: 'Detail',

    data() {
      return {
        pid: '',

        currentProData: {},

        isActive: false,

        isLike: false,

        isBuy: false,

        proCount: 0,

        proInfo: {count: 0}

      }
    },

    created() {
      this.pid = this.$route.params.pid;
      this.getDetailInfo();
      this.checkAllLike();
      this.checkShopBag();
      

    },
    methods: {
      // 切换规则
      toggleRule(item,i) {
        if(item.activeIndex == i) {
          return;
        }
        item.activeIndex = i;
      },

      // 返回
      goBack() {
        this.$router.go(-1);
      },

      // 获取商品详情信息
      getDetailInfo() {
        this.axios({
          method: 'GET',
          url: '/productDetail',
          params: {
            appkey: this.appkey,
            pid: this.pid
          }
        }).then(result => {
          if(result.data.code == 600){
            let detail = result.data.result[0];
            detail.desc = detail.desc.split(/\n/);
            // 构造规则数据rules
            let rules = [];
            let rulesInfo = ['tem','sugar','milk','cream'];
            rulesInfo.map(v => {
              let r = {};
              // 激活下标 默认第一个
              r.activeIndex = 0;
              r.title = detail[v+'_desc'];
              r.rule = [];
              let ruleData = detail[v].split('/');
              ruleData.map(value => {
                if(value!='') {
                  r.rule.push({title:value});
                }
              })
              if(r.rule.length>0) {
                rules.push(r);
              }
            })
            // 
            detail.rules = rules;
            this.currentProData = detail;
            // 
          }
        }).catch(err => {
          
        })
      },

      // 切换收藏
      toggleLikePro() {
        let tokenString = localStorage.getItem('tokenString');
        if(!tokenString){
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }
        
        let url = this.isLike ? 'notlike' : 'like';

        let data = {
          appkey: this.appkey,
          pid: this.pid,
          tokenString
        }

        // 加载图标
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method: 'POST',
          url,
          data
        }).then(result => {
          
          this.$toast.clear();
          if(result.data.code == 700) {
            this.$router.push({name: 'Login'});
          }else if(result.data.code == 800) {
            this.$toast(result.data.msg);
            this.isLike = true;
          }else if(result.data.code == 900) {
            this.$toast(result.data.msg);
            this.isLike = false;
          }
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      // 查询收藏的商品
      checkAllLike() {
        let tokenString = localStorage.getItem('tokenString');
        // 验证token的值
        if(!tokenString){
          return;
        }

        // 加载图标
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method: 'GET',
          url: '/findlike',
          params: {
            appkey: this.appkey,
            pid: this.pid,
            tokenString
          }
        }).then(result => {
          // 
          this.$toast.clear();
          if(result.data.code == 1000) {
            if(result.data.result.length > 0) {
              this.isLike = true;
            }
          }
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      // 加入购物袋
      addShopBag(isBuy) {
        let tokenString = localStorage.getItem('tokenString');
        if(!tokenString){
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }
        // 需提交的参数
        let data = {
          appkey: this.appkey,
          pid: this.pid,
          count: this.proInfo.count,
          tokenString,
        }
        let pro_rule = [];
        this.currentProData.rules.map(v => {
          pro_rule.push(v.rule[v.activeIndex].title);
        })
        data.rule = pro_rule.join('/');

        // 加载图标
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method: 'POST',
          url: '/addShopcart',
          data
        }).then(result => {
          
          this.$toast.clear();
          if(result.data.code == 700) {
            this.$router.push({name: 'Login'});
          }else if(result.data.code == 3000) {
            if(!isBuy) {
              // status=1表示添加了新的商品
              // status=0表示修改了数量
              if(result.data.status == 1) {
                this.proCount++;
              }
            }else{
              this.$router.push({name: 'Pay', query: {sids: result.data.sid}})
            }
            
          }
          this.$toast(result.data.msg);
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      // 查询购物袋
      checkShopBag() {
        let tokenString = localStorage.getItem('tokenString');
        // 验证token的值
        if(!tokenString){
          return;
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
          
          this.$toast.clear();
          if(result.data.code == 5000) {
            this.proCount = result.data.result.length;
          }
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      // 立即购买
      buyNow(isBuy) {
        this.addShopBag(isBuy)
      }


    }
  }
</script>

<style lang="less" scoped>

</style>