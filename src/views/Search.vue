<template>
  <div class="search">
    <van-nav-bar
      title="搜索"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    >
      <template #right>
        <div class="search-box">
          <van-search 
            ref="searchInp"
            v-model="name"
            placeholder="输入商品名称"
            shape="round"
            fixed
            show-action
            background="#ffffff"
            @search="search"
            />
      </div>
      </template>
    </van-nav-bar>

    <div class="history-box">
      <div class="title clearfix" v-if="historyList.length > 0">
        <div class="fl">历史搜索</div>
        <div>
          <div class="fr remove-icon"><van-icon name="delete" size="16" @click="empty"/></div>
          <div class="fr clear">清空</div>
        </div>
      </div>
      <div class="history">
        <div class="history-item" v-for="(item,index) in historyList" :key="index" @click="goSearch(item)">{{item}}</div>
      </div>
    </div>

    <div class="pro-content">
      <div class="pro-item" v-for="(item,index) in products" :key="index" @click="goDetail(item.pid)">
        <ProductItem :item="item"></ProductItem>
      </div>  
    </div>


  </div>
</template>

<script>
  import '../assets/less/search.less'
  import ProductItem from '../components/ProductItem.vue'
  export default {
    name: 'Search',
    components: {
      ProductItem
    },
    data() {
      return {
        name: '',
        products: [],
        historyList: []
      }
    },

    created() {
      // 获取焦点
      this.$nextTick(() => {
        let inp = this.$refs.searchInp.querySelector('[type="search"]');
        inp.focus();
      });
      // 初始化历史搜索列表
      let historyData = localStorage.getItem('historyList');
      if(!historyData){
        return;
      }else{
        this.historyList = JSON.parse(historyData)
      }
    },

    methods: {
      back() {
        this.$router.go(-1);
      },

      // 发起搜索请求
      getSearchPro(name) {
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });

        this.axios({
          method: "GET",
          url: "/search",
          params: {
            appkey: this.appkey,
            name
          },
        })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == "Q001") {
            this.products = result.data.result;
            if(this.products.length == 0 ){
              this.$toast("暂无该商品，换个关键词试试~");
            }
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        })
      },

      // 回车 搜索
      search() {
        let reg = /^[ ]+$/;

        if(this.name=='' || reg.test(this.name)) {
          this.$toast('请输入搜索内容');
          return;
        }
        // 检查有无搜索记录
        if(!this.historyList.includes(this.name)){
          this.historyList.unshift(this.name);
          localStorage.setItem('historyList',JSON.stringify(this.historyList));
        }else{
          let i = this.historyList.indexOf(this.name);
          this.historyList.splice(i,1)
          this.historyList.unshift(this.name);
          localStorage.setItem("historyList", JSON.stringify(this.historyList));
        }
        // 发起搜索请求
        this.getSearchPro(this.name);
      },

      // 点击历史记录搜索
      goSearch(title) {
        this.name = title;
        let i = this.historyList.indexOf(title);
        this.historyList.splice(i,1)
        this.historyList.unshift(title);
        localStorage.setItem("historyList", JSON.stringify(this.historyList));
        // 发起请求
        this.getSearchPro(title);
      },

      // 清空
      empty() {
        localStorage.removeItem('historyList');
        this.historyList = [];
      },

      //查看商品详情
      goDetail(pid) {
        this.$router.push({name: 'Detail', params: {pid}});
      },

    }
  }
</script>

<style lang="less" scoped>

.pro-item{
  width: calc(~"50% - 5px");
  margin-bottom: 10px;
  box-shadow: 0px 0px 2px #ccc;
  border-radius: 5px;
  overflow: hidden;
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

