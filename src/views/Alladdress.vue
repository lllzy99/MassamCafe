<template>
  <div class="allAddress">
    <van-nav-bar
      title="地址管理"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />

    <BgBlock>
      <div v-if="list.length > 0">
          <div class="address-box">
          <van-address-list
            :list="list"
            :switchable="false"
            default-tag-text="默认"
            @add="onAdd"
            @edit="onEdit"
          />
        </div>
      </div>

      <div v-else>
        <van-empty description="没有收货地址信息" />
      </div>
      
    </BgBlock>
    
  </div>
</template>

<script>
  import BgBlock from '../components/BgBlock'
  import '../assets/less/allAddress.less'
  export default {
    name:'Alladdress',

    components: {
      BgBlock
    },

    data() {
      return {
        list: []
      }
    },

    created() {
      this.getAddressInfo();
    },

    methods: {
      back() {
        this.$router.go(-1);
      },

      getAddressInfo() {
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
            })
            this.list = result.data.result;
          }
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      // 新增地址
      onAdd() {
        this.$router.push({name: 'NewAddress'});
      },
      
      // 编辑地址
      onEdit(item) {
        this.$router.push({name: 'NewAddress', query: {aid:item.aid}});
      }
    }
  }
</script>