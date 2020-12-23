<template>
  <div class="main">
    <div>
      <!-- 二级路由 -->
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    
    <van-tabbar v-model="activeName" active-color="#017a56" inactive-color="#4a4a4a" route>
      <van-tabbar-item :icon="item.icon" v-for="(item,index) in tabbarData" :key="index" :name="item.name" replace :to="item.path">
        <span>{{item.title}}</span>

        <template #icon="props">
          <img :src="props.active ? item.active : item.inactive" />
        </template>

      </van-tabbar-item>
    </van-tabbar>

  </div>
</template>

<script>
  export default {
    name: 'Main',
    data() {
      return {
        activeName: 'Home',
        
        tabbarData: [
          {
            title: '首页',
            icon: 'home-o',
            name: 'Home',
            path: '/main/home',
            inactive: require('../assets/images/home.png'),
            active: require('../assets/images/home-active.png'),
          },
          {
            title: '菜单',
            icon: 'home-o',
            name: 'Menu',
            path: '/main/menu',
            inactive: require('../assets/images/menu.png'),
            active: require('../assets/images/menu-active.png'),

          },
          {
            title: '购物袋',
            icon: 'home-o',
            name: 'Shoppingbag',
            path: '/main/shoppingbag',
            inactive: require('../assets/images/shopcar.png'),
            active: require('../assets/images/shopcar-active.png'),

          },
          {
            title: '我的',
            icon: 'home-o',
            name: 'My',
            path: '/main/my',
            inactive: require('../assets/images/my.png'),
            active: require('../assets/images/my-active.png'),

          },
        ]
      }
    }
  }
</script>

<style lang="less" scoped>
  .main {
    padding-bottom: 50px;
    /deep/ .van-tabbar-item__text{
      color: #4c4c4c;
    }
  }
</style>