<template>
  <div class="secure">
    <van-nav-bar
      title="安全中心"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />

    <BgBlock>
      <van-cell title="修改密码" is-link :border="false" @click="showPop"/>
      <van-cell title="注销账号" is-link :border="false"  @click="destoryAccount"/>

       <!-- 弹出层 -->
      <van-popup class="popoup-box" v-model="isPopup" position="bottom" :closeable="true">
        <div class="popup-title">修改密码</div>
          <van-form class="register-box">
            <van-field
              v-model="password.oldPassword"
              :type="oldpassIcon ? 'password' : 'text'"
              name="原密码"
              label="原密码"
              placeholder="字母开头 6-16位"
              :right-icon="oldpassIcon ? 'closed-eye' : 'eye-o'"
              autocomplete="off"
              @click-right-icon="toggleOldIcon"
            />
            <van-field
              v-model="password.newPassword"
              :type="newpassIcon ? 'password' : 'text'"
              name="新密码"
              label="新密码"
              placeholder="字母开头 6-16位"
              :right-icon="newpassIcon ? 'closed-eye' : 'eye-o'"
              autocomplete="off"
              @click-right-icon="toggleNewIcon"
            />
            <div class="submit-btn">
              <van-button round block color="#2bab7b" @click="updatePassword">
                保存修改
              </van-button>
            </div>
          </van-form>
      </van-popup>

      <div class="submit-btn">
        <van-button round block color="#2bab7b" @click="logout">
          退出登录
        </van-button>
      </div>
    </BgBlock>
  </div>
</template>

<script>
  import BgBlock from '../components/BgBlock'
  import '../assets/less/secure.less'
  import { validForm } from "../assets/js/validForm"

  export default {
    name: 'Secure',
    components: {
      BgBlock
    },

    data() {
      return {
        isPopup: false,
        oldpassIcon: true,
        newpassIcon: true,
        password: {
          newPassword: '',
          oldPassword: '',
        }
      }
    },

    methods: {
      back() {
        this.$router.go(-1);
      },
      showPop(){
        this.isPopup = true;
      },
      toggleOldIcon(){
        this.oldpassIcon = !this.oldpassIcon;
      },
      toggleNewIcon(){
        this.newpassIcon = !this.newpassIcon;
      },

      // 退出登录
      logout() {
        this.$dialog.confirm({
          title: "退出登录",
          message: "是否确定退出登录?",
          confirmButtonColor: "#2bab7b",
        }).then(() => {
          //清除登录状态
          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0,
          });

          setTimeout(() => {
            this.$toast.clear();
            localStorage.removeItem("tokenString");
            this.$router.push({ name: "Login" });
          }, 800);
        }).catch((err) => {
          
        })
          
      },
      // 修改密码
      updatePassword() {
        //构造表单验证信息
        let o = {
          oldPassword: {
            value: this.password.oldPassword,
            errorMsg: "字母开头 6-16位",
            reg: /^[A-Za-z]\w{5,15}$/,
          },
          newPassword: {
            value: this.password.newPassword,
            errorMsg: "字母开头 6-16位",
            reg: /^[A-Za-z]\w{5,15}$/,
          },
        }

        // 判断有无输入内容
        for(let k in o){
          if(!k.value){
            this.$toast("请输入要修改的密码");
            return;
          }
        }

        let isPass = validForm.valid(o);

        if(isPass) {
          if(this.password.newPassword == this.password.oldPassword) {
            this.$toast('新密码和旧密码不能相同');
            return;
          }

          let tokenString = localStorage.getItem("tokenString");

          if (!tokenString) {
            this.$toast("请先登录");
            return this.$router.push({ name: "Login" });
          }

          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0,
          });

          this.axios({
            method: "POST",
            url: "/updatePassword",
            data: {
              appkey: this.appkey,
              tokenString,
              password: this.password.newPassword,
              oldPassword: this.password.oldPassword,
            },
          })
          .then((result) => {
            this.$toast.clear();
            if (result.data.code == 700) {
              this.$router.push({ name: "Login" });
            } else if (result.data.code == "E001") {
              setTimeout(() => {
                localStorage.removeItem("tokenString");
                this.$router.push({ name: "Login" });
              }, 800);
            }

            this.$toast(result.data.msg);
          })
          .catch((err) => {
            this.$toast.clear();
            
          });
        }

      },
      //注销账号
      destoryAccount() {
        this.$dialog
        .confirm({
          title: "注销账号",
          message: "是否确定注销账号，一旦注销无法恢复！",
          confirmButtonColor: "#2bab7b",
        })
        .then(() => {
          //发起注销账号请求
          let tokenString = localStorage.getItem("tokenString");

          if (!tokenString) {
            //跳回登录页面
            this.$toast("请先登录");
            return this.$router.push({ name: "Login" });
          }

          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0,
          });

          this.axios({
            method: "POST",
            url: "/destroyAccount",
            data: {
              appkey: this.appkey,
              tokenString,
            },
          })
            .then((result) => {
              this.$toast.clear();
              if (result.data.code == 700) {
                this.$router.push({ name: "Login" });
              } else if (result.data.code == "G001") {
                //清除登录状态
                localStorage.removeItem("tokenString");
                setTimeout(() => {
                  this.$router.push({ name: "Login" });
                }, 800);
              }
              this.$toast(result.data.msg);
            })
            .catch((err) => {
              this.$toast.clear();
              
            });
        })
        .catch((err) => {
          
        });
      }

    }
  }
</script>
