<template>
  <div class="login">

    <van-nav-bar left-text="返回" right-text="先逛一逛" @click-right="goPage">
      <template #left>
        <div class="nav-left">
          <div class="logo">
            <img class="auto-img" src="../assets/images/logo.png" alt="">
          </div>
          <div class="logo-text">Massam Cafe</div>
        </div>
      </template>
    </van-nav-bar>

    <div class="user-info">
      <div class="title-box">
        <div class="welcome">欢迎登录</div>
        <div class="sub-title">please login to your account</div>
      </div>

      <van-form>
        <van-field
          v-model="userLoginInfo.phone"
          name="手机号"
          label="手机号"
          placeholder="手机号"
          autocomplete="off"
        />
        <van-field
          v-model="userLoginInfo.password"
          :type="isRegisterPassType ? 'password' : ''"
          name="密码"
          label="密码"
          placeholder="密码"
          :right-icon="isRegisterPassType ? 'closed-eye' : 'eye-o'"
          autocomplete="off"
          @click-right-icon="togglePasswordIcon"
        />

        <div class="forgot-box">
          <span @click="goForgot">忘记密码?</span>
        </div>

        <div class="submit-btn">
          <van-button round block color="#2bab7b" @click="login">
            登录
          </van-button>
        </div>
        <div class="submit-btn">
          <van-button round block type="default" @click="toggleRegisterLayer" >
            注册
          </van-button>
        </div>

        <van-popup v-model="isShow" round position="bottom" closeable>
          <van-form class="register-box">
            <div class="register-title">
              <span>注册</span>
            </div>

            <van-field
              v-model="userRegisterInfo.phone"
              name="手机号"
              label="手机号"
              placeholder="手机号"
              autocomplete="off"
            />
            <van-field
              v-model="userRegisterInfo.password"
              :type="isRegisterPassType ? 'password' : 'text'"
              name="密码"
              label="密码"
              placeholder="支持6-16位字母数字下划线"
              :right-icon="isRegisterPassType ? 'closed-eye' : 'eye-o'"
              autocomplete="off"
              @click-right-icon="togglePasswordIcon"
            />
            <van-field
              v-model="userRegisterInfo.nickName"
              name="昵称"
              label="昵称"
              maxlength="10"
              placeholder="支持1-10位字母数字_组合"
              autocomplete="off"
            />
            <div class="submit-btn" style="margin: 16px;">
              <van-button round block color="#2bab7b" @click="register">
                注册
              </van-button>
            </div>
          </van-form>
        </van-popup>
      </van-form>
    </div>

  </div>

</template>
<script>
  import '../assets/less/login.less';
  import {validForm} from '../assets/js/validForm';
  export default {
    name: 'Login',
    data() {
      return {
        isShow: false,

        isRegisterPassType: true,

        userLoginInfo: {
          phone: '',
          password: ''
        },

        userRegisterInfo: {
          phone: '',
          password: '',
          nickName: ''
        }
      }
    },

    methods: {
      // 切换注册页面
      toggleRegisterLayer() {
        this.isShow = true;
      },
      // 密码图标
      togglePasswordIcon() {
        this.isRegisterPassType = !this.isRegisterPassType;
      },
      
      // 验证注册
      register() {
        let o = {
          phone: {
            value: this.userRegisterInfo.phone,
            errMsg: '手机号格式不正确',
            reg: /^1[3-9]\d{9}$/
          },
          password: {
            value: this.userRegisterInfo.userpass,
            errMsg: '密码格式不正确',
            reg: /^[A-Za-z]\w{5,15}$/
          },
          nickName: {
            value: this.userRegisterInfo.nickName,
            errMsg: '昵称不正确',
            reg: /^[\w\u4e00-\u9fa5]{1,10}$/
          }
        }

        let isPass = validForm.valid(o);

        if(isPass) {
          // 加载图标
          this.$toast.loading({
            message: '加载中...',
            forbidClick: true,
            duration: 0
          })

          // 复制用户注册信息
          let registerInfo = Object.assign({},this.userRegisterInfo);
          registerInfo.appkey = this.appkey;

          // 发起请求
          this.axios({
            method: 'POST',
            url: '/register',
            data: registerInfo,
          }).then( result => {
            this.$toast.clear();
            
            // 注册成功
            if(result.data.code == 100) {
              this.$toast(result.data.msg);
              // 清空内容 隐藏注册层
              for(var key in this.userRegisterInfo) {
                this.userRegisterInfo[key] = '';
                this.isShow = false;
              }
            }else{
              // 注册失败提示
              this.$toast(result.data.msg);
            }
          }).catch( err => {
            this.$toast.clear();
            
          })
        }
      },

      // 验证登录
      login() {
        // let loginInfo = this.userLoginInfo;
        let loginInfo = Object.assign({}, this.userLoginInfo);
        loginInfo.appkey = this.appkey;

        let o = {
          phone: {
            value: loginInfo.phone,
            errMsg: '手机号格式不正确',
            reg: /^1[3-9]\d{9}$/
          },
          password: {
            value: loginInfo.password,
            errMsg: '密码格式不正确',
            reg: /^[A-Za-z]\w{5,15}$/
          }
        }
        let isPass = validForm.valid(o);

        if(isPass) {
          this.$toast.loading({
            message: '加载中...',
            forbidClick: true,
            duration: 0
          })

          this.axios({
            method: 'POST',
            url: '/login',
            data: loginInfo
          }).then(result => {
            // 登录成功
            if(result.data.code == 200) {
              this.$toast.clear();
              this.$toast(result.data.msg);
              localStorage.setItem('tokenString',result.data.token);
              // 跳转首页
              this.$router.push({name:'Main'});
            }else{
              this.$toast(result.data.msg);
            }
          }).catch(err => {
            
          })
        }

      },

      // 跳转主页
      goPage() {
        this.$router.push({name: 'Home'});
      },

      // 忘记密码
      goForgot() {
        this.$router.push({name: 'Forgot'})
      }

    }


  }
</script>
