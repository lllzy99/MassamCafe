<template>
  <div class="home">
     <van-nav-bar 
     fixed
     :left-text="greetText + (userInfo.nickName==undefined? '':userInfo.nickName)"
     :right-text="subgreetText">
      <template #left>
      </template>
    </van-nav-bar>

    <div class="home-content">
      <div class="home-banner">
        <van-swipe :autoplay="3000" @change="onChange">
          <van-swipe-item
          v-for="(item,index) in bannerData"
          :key="index"
          @click="goDetail(item.pid)">
            <img :src="item.bannerImg" class="auto-img">
          </van-swipe-item>
          <template #indicator>
            <div class="banner-index" :style="{width:bannerData.length*10+'px'}">
              <div class="banner-circle" :class="{active: index==current}" v-for="(item,index) in bannerData" :key="index"></div>
            </div>
          </template>
        </van-swipe>
      </div>

      <div class="home-product" >
        <div class="pro-title" >
          <div class="pro-title-text">热卖推荐</div>
        </div>
        <div class="pro-content">
          <div class="pro-item" v-for="(item,index) in productData" :key="index" @click="goDetail(item.pid)">
            <ProductItem :item="item"></ProductItem>
          </div>
        </div>
      </div>

    </div>
    
  </div>
</template>

<script>
  import '../assets/less/home.less'
  import ProductItem from  '../components/ProductItem.vue'
  export default {
    name: 'Home',

    components: {
      ProductItem
    },

    data() {
      return {
        greetText: '',
        subgreetText: '',
        current: 0,
        bannerData: [],
        productData: [],
        userInfo:{}
      }
    },
    created() {
      this.getCurrentTime();
      this.getBannerInfo();
      this.getProductInfo();
      this.getAccountInfo();
    },

    methods: {

      getCurrentTime() {
        let current_hour = new Date().getHours();
        if(current_hour>=6 && current_hour<12) {
          this.greetText = '早上好！';
          this.subgreetText = '今天要喝点什么?'
        }else if(current_hour>=12 && current_hour<18) {
          this.greetText = '下午好！'
          this.subgreetText = '午休完放松一下吧！'
        }else if(current_hour>=18 && current_hour<21) {
          this.greetText = '晚上好！'
          this.subgreetText = '注意身体，最晚营业至21:00'
        }else {
          this.greetText = '晚安！'
          this.subgreetText = '别熬夜，9:00开始营业'
        }
      },

      onChange(index) {
        this.current = index;
      },

      // 获取轮播图信息
      getBannerInfo() {
        // 先查看本地有没有缓存,有缓存数据且没有过期,直接从本地获取,不再发起请求
        const bannerFromLocal = localStorage.getItem('banner_data');
        if(bannerFromLocal && JSON.parse(bannerFromLocal).expired > Date.now()){
          this.bannerData = JSON.parse(bannerFromLocal).data;
          return;
        }
        // 发起轮播请求
        this.axios({
          method: 'GET',
          url: '/banner',
          params: {
            appkey: this.appkey
          }
        })
        .then(result => {
          if(result.data.code == 300) {
            this.bannerData = result.data.result;
            console.log('11')
            // 本地缓存 过期时间为2小时 实现数据持久化
            localStorage.setItem(
              'banner_data',
              JSON.stringify({
                data: result.data.result,
                expired: Date.now() + 2*60*60*1000
              })
            );
          }
        })
        .catch(err => {
          
        })
      },
      // 获取热卖推荐商品
      getProductInfo() {
        // 查看缓存
        const hotProFromLocal = localStorage.getItem('hot_products');
        if(hotProFromLocal && JSON.parse(hotProFromLocal).expired > Date.now()){
          this.productData = JSON.parse(hotProFromLocal).data;
          return;
        }

        this.axios({
          method: 'GET',
          url: '/typeProducts',
          params: {
            appkey: this.appkey,
            key: 'isHot',
            value: 1
          }
        }).then(result => {
          if(result.data.code == 500) {
            this.productData = result.data.result;

            // 缓存推荐商品
            localStorage.setItem(
              'hot_products',
              JSON.stringify({
                data: result.data.result,
                expired: Date.now() + 2*60*60*1000
              })
            )

          }
        }).catch(err => {
          
        })
      },

      //获取个人资料 绑定用户名
      getAccountInfo() {
        let tokenString = localStorage.getItem("tokenString");

        if (!tokenString) {
          return;
        }

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });

        this.axios({
          method: "GET",
          url: "/findMy",
          params: {
            appkey: this.appkey,
            tokenString,
          },
        })
        .then((result) => {
          this.$toast.clear();
          if(result.data.code == 'A001'){
            this.userInfo = result.data.result[0];
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
      },

      goDetail(pid) {
        this.$router.push({name:'Detail',params:{pid}})
      }

    }
  }
</script>
