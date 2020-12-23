<template>
  <div class="new-address">
    <van-nav-bar
      :title="aid ? '编辑地址' : '新增地址'"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />

    <div class="new-address-box">
      <van-address-edit
        :area-list="areaList"
        show-postal
        :show-delete="!!aid"
        :address-info="addressInfo"
        show-set-default
        show-search-result
        :area-columns-placeholder="['请选择省份', '请选择市', '请选择']"
        @save="onSave"
        @delete="removeAddress"
      />
    </div>

  </div>
</template>

<script>
  import areaList from '../assets/js/area'
  export default {
    name: 'NewAddress',

    data() {
      return {
        areaList,
        aid: '',
        // 初始化地址信息
        addressInfo: {},
      }
    },

    created() {
      this.aid = this.$route.query.aid;

      if(this.aid) {
        this.getAddressByAid();
      }
    },

    methods: {
      back() {
        this.$router.go(-1);
      },

      onSave(content) {
        // 

        let tokenString = localStorage.getItem('tokenString');
        // 验证token的值
        if(!tokenString){
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }

        let addressInfo = Object.assign({},content);
        delete addressInfo.country

        addressInfo.appkey = this.appkey;
        addressInfo.tokenString = tokenString;
        addressInfo.isDefault = Number(addressInfo.isDefault);

        // 加载图标
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        // 判断是新增地址还是编辑地址
        if(!this.aid) {
          this.changeAdress(addressInfo,'/addAddress');
        }else {
          let isModify = false;
          for(let key in this.addressInfo) {
            if(content[key] != this.addressInfo[key]) {
              isModify = true;
            }
          }

          if(isModify) {
            this.changeAdress(addressInfo,'/editAddress');
          }else {
            return this.$toast('请修改地址信息');
          }
        }
      },

      // 新增地址 或 修改地址
      changeAdress(addressInfo,url) {
        this.axios({
          method: 'POST',
          url,
          data: addressInfo
        }).then(result => {
          this.$toast.clear();
          if(result.data.code == 9000 || result.data.code == 30000) {
            this.$router.push({name: 'Alladdress'})
          }
          this.$toast(result.data.msg);
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      // 根据aid查询地址
      getAddressByAid() {
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
          url: '/findAddressByAid',
          params: {
            appkey: this.appkey,
            tokenString,
            aid: this.aid
          }
        }).then(result => {
          // 
          this.$toast.clear();
          if(result.data.code == 40000) {
            let res = result.data.result[0]
            res.isDefault = Boolean(res.isDefault);
            this.addressInfo = result.data.result[0];
          }
         
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      // 删除地址
      removeAddress() {
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
          url: '/deleteAddress',
          data: {
            appkey: this.appkey,
            tokenString,
            aid: this.aid
          }
        }).then(result => {
          
          this.$toast.clear();
          if(result.data.code == 10000) {
            // 删除成功 跳转到地址列表页
            setTimeout(() => {
              this.$router.push({name: 'Alladdress'});
            },800)
          }
          this.$toast(result.data.msg);
        }).catch(err => {
          this.$toast.clear();
          
        })
      }

     
    }
  }
</script>

<style lang="less" scoped>
  .new-address{
    padding-top: 46px;

    /deep/ .van-nav-bar__text{
      color: #2bab7b;
    }
    /deep/ .van-nav-bar__title{
      color: #4c4c4c;
    }
    /deep/ .van-nav-bar .van-icon{
      color: #2bab7b;
    }
    /deep/ .van-button--danger{
      background-color: #2bab7b;
      border-color: #2bab7b;
    }
    /deep/ .van-switch--on{
      background-color: #2bab7b;
    }
  }
</style>