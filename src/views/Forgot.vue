<template>
  <div class="forgot">

    <van-nav-bar left-text="返回" right-text="先逛一逛" @click-right="goPage('Home')">
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
        <div class="welcome">忘记密码</div>
        <div class="sub-title">forgot password!</div>
      </div>

      <van-form v-if="!isNext">
         <van-field
          v-model="userInfo.email"
          name="邮箱"
          label="邮箱"
          placeholder="邮箱"
          autocomplete="off"
        />
        <van-field
          center
          v-model="userInfo.validCode"
          name="邮箱验证码"
          label="邮箱验证码"
          placeholder="请输入邮箱验证码"
          autocomplete="off"
        >
        <template #button v-if="!isNext">
          <van-button class="validcode-btn" size="small" color="#2bab7b" :disabled="isSend" @click="sendValidCode" >{{text}}</van-button>
        </template>
        </van-field>

        <div class="forgot-text">
          <span @click="goPage('Login')">已有账号，立即登录</span>
        </div>

        <div class="submit-btn">
          <van-button round block color="#2bab7b" @click="next">
            下一步
          </van-button>
        </div>

      </van-form>

      <van-form v-else>
        <van-field
          v-model="userInfo.phone"
          name="手机号"
          label="手机号"
          placeholder="手机号"
          autocomplete="off"
        />
        <van-field
          v-model="userInfo.password"
          :type="isPassType ? 'password' : ''"
          name="新密码"
          label="新密码"
          placeholder="新密码"
          :right-icon="isPassType ? 'closed-eye' : 'eye-o'"
          autocomplete="off"
          @click-right-icon="togglePasswordIcon"
        />

        <div class="forgot-text">
          <span @click="goPage('Login')">已有账号，立即登录</span>
        </div>

        <div class="submit-btn">
          <van-button round block color="#2bab7b" @click="resetPassWord">
            提&nbsp;&nbsp;交
          </van-button>
        </div>

      </van-form>

     </div>

  </div>
</template>

<script>
  import '../assets/less/forgot.less'
  import {validForm} from '../assets/js/validForm'

  export default {
    name: 'Forgot',

    data() {
      return {
        isPassType: true,

        userInfo: {
          phone: '',
          password: '',
          email: '',
          validCode: ''
        },

        text: '发送验证码',
        isSend: false,
        // 下一步
        isNext: false

      }
    },

    methods: {
      goPage(name) {
        this.$router.push({name})
      },

      togglePasswordIcon() {
        this.isPassType = !this.isPassType;
      },

      // 发送验证码
      sendValidCode() {
        let o = {
          email: {
            value: this.userInfo.email,
            errMsg: '邮箱格式不正确',
            reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
          }
        }

        let isPass = validForm.valid(o);
        if(!isPass) {
          return;
        }

        let time = 60;
        this.text = time + 's后重新发送';
        this.isSend = true;
        let timer = setInterval(() => {
          if(time == 0) {
            clearInterval(timer);
            this.isSend = false;
            this.text = '发送验证码';
          }else {
            time--;
            this.text = time + 's后重新发送';
          }
        }, 1000)
        // 发送获取验证码请求
        this.$toast.loading({
            message: '加载中...',
            forbidClick: true,
            duration: 0
        })

        let data = {
          appkey: this.appkey,
          email: this.userInfo.email
        }
        this.axios({
          method: 'POST',
          url: '/emailValidCode',
          data
        }).then(result => {
          this.$toast.clear();
          
          this.$toast(result.data.msg);
        }).catch(err => {
          
        })

      },

      // 下一步
      next() {
        let o = {
          email: {
            value: this.userInfo.email,
            errMsg: '邮箱格式不正确',
            reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
          },
          validCode: {
            value: this.userInfo.validCode,
            errMsg: '验证码应为6位数',
            reg: /^\d{6}$/
          }
        }

        let isPass = validForm.valid(o);
        if(!isPass){
          return;
        }
        // step1 验证邮箱验证码
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        let data = {
          appkey: this.appkey,
          validCode: this.userInfo.validCode
        }
        this.axios({
          method: 'POST',
          url: '/checkValidCode',
          data
        }).then(result => {
          this.$toast.clear();
          
          if(result.data.code == 'K001'){
            // 验证成功
            // 下一步
            this.isNext = true;
            // this.$toast(result.data.msg);
          }
        }).catch(err => {
          
        })
      },

      // 重设密码
      resetPassWord() {
        let o = {
           phone: {
            value: this.userInfo.phone,
            errMsg: '手机号格式不正确',
            reg: /^1[3-9]\d{9}$/
          },
          password: {
            value: this.userInfo.password,
            errMsg: '密码格式不正确',
            reg: /^[A-Za-z]\w{5,15}$/
          },
        }

        let isPass = validForm.valid(o);
        if(!isPass){
          return;
        }

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        let data = {
          appkey: this.appkey,
          phone: this.userInfo.phone,
          password: this.userInfo.password
        }
        this.axios({
            method: 'POST',
            url: '/retrievePassword',
            data
          }).then(result => {
            this.$toast.clear();
            
            if(result.data.code == 'L001'){
              // 找回密码成功
              this.$router.push({name: 'Login'});
              this.$toast('已重设密码')
            }else{
              this.$toast(result.data.msg);
            }
          }).catch(err => {
            
          })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>