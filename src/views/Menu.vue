<template>
  <div class="menu">
    <div class="menu-nav">
      <div class="menu-search">
        <van-search placeholder="输入商品名称" shape="round" fixed background="#ffffff" @focus="searchFocus" />
      </div>

      <div class="bg">
        <!-- <img src="../assets/images/shopbag_bg.png" alt=""> -->
      </div>

      <van-sticky>
        <div class="menu-option">
          <div
            class="menu-item"
            v-for="(item, index) in menuOptions"
            :key="index"
            @click="toggleMenu(index, item.type)"
          >
            <div class="m-item">
              <div class="m-text" :class="{ active: menuIndex == index }">
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
      </van-sticky>
    </div>

    <div class="menu-product">
      <div class="clearfix m-pro-item" v-for="(item, index) in productData" :key="index" @click="goDetail(item.pid)">
        <div class="fl pro-img">
          <img
            class="auto-img"
            :src="item.smallImg"
            alt=""
          />
        </div>
        <div class="fl text">
          <div class="pro-text">
            <div class="pro-name">{{item.name}}</div>
            <div class="pro-enname">{{item.enname}}</div>
          </div>
        </div>
        <div class="fl price">￥{{item.price}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/menu.less";
export default {
  name: "Menu",
  data() {
    return {
      menuIndex: 0,

      menuOptions: [
        {
          title: "推荐",
        },
        {
          title: "拿铁",
        },
        {
          title: "咖啡",
        },
        {
          title: "瑞纳冰",
        },
      ],

      //商品数据
      productData: []
    };
  },

  created() {
    //获取商品类型
    this.getTypes();
  },

  methods: {
    //切换菜单商品
    toggleMenu(index, type) {
      if (this.menuIndex == index) {
        return;
      }

      this.menuIndex = index;

      this.getProductByType(type);
    },

    //获取商品类型
    getTypes() {

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/type",
        params: {
          appkey: this.appkey
        },
      })
        .then((result) => {
          this.$toast.clear();
          

          if (result.data.code == 400) {
            let data = result.data.result;
            data.unshift({
              type: 'isHot',
              typeDesc: '推荐'
            })

            this.menuOptions.map(v => {
              for (let i = 0; i < data.length; i++) {
                if (v.title == data[i].typeDesc) {
                  v.type = data[i].type;
                  break;
                }
              }
            })

            let type = this.menuOptions[this.menuIndex].type;

            this.getProductByType(type);

          }

        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //根据类型获取商品
    getProductByType(type) {

      let params = {
        appkey: this.appkey
      };
      if (type == 'isHot') {
        params.key = 'isHot';
        params.value = 1;
      } else {
        params.key = 'type';
        params.value = type;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/typeProducts",
        params,
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 500) {
            this.productData = result.data.result;
          }

        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //跳转到详情页
    goDetail(pid){
      this.$router.push({name: 'Detail', params: {pid}});
    },

    //搜索栏获取焦点
     searchFocus() {
       this.$router.push({name: 'Search'});
     } 
  },
};
</script>