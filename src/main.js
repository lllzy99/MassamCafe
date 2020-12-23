import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'lib-flexible/flexible'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios,axios)


import {
  NavBar,
  Button,
  Form,
  Field,
  Popup,
  Tabbar,
  TabbarItem,
  Toast,
  Search,
  Swipe,
  SwipeItem,
  Tab,
  Tabs,
  Icon,
  Stepper,
  GoodsAction,
  GoodsActionButton,
  GoodsActionIcon,
  SwipeCell,
  Cell,
  Card,
  Empty,
  Checkbox,
  CheckboxGroup,
  SubmitBar,
  List,
  AddressEdit,
  Area,
  AddressList,
  Dialog,
  Uploader,
  Sticky
} from 'vant';

Vue
  .use(NavBar)
  .use(Button)
  .use(Form)
  .use(Field)
  .use(Popup)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Toast)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(Tab)
  .use(Tabs)
  .use(Icon)
  .use(Stepper)
  .use(GoodsAction)
  .use(GoodsActionButton)
  .use(GoodsActionIcon)
  .use(SwipeCell)
  .use(Cell)
  .use(Card)
  .use(Empty)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(SubmitBar)
  .use(List)
  .use(AddressEdit)
  .use(Area)
  .use(AddressList)
  .use(Dialog)
  .use(Uploader)
  .use(Sticky)

// 拦截器
axios.interceptors.request.use(config => {
  // 
  if(config.method == 'post') {
    let paramsString = '';
    for(let key in config.data) {
      paramsString += `${key}=${config.data[key]}&`;
    }
    config.data = paramsString.slice(0,-1);
    }
    return config;
})

// 设置原型key
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

// 配置请求基础路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'

// 过滤器 保留两位小数
Vue.filter('reset',(v,n=2) => {
  return v.toFixed(n);
})

// 过滤器 格式化日期
Vue.filter('formatDate',(v,format) => {
  let date = new Date(v);
  let year = date.getFullYear();
  if(/(y+)/.test(format)) {
    var content = RegExp.$1;
    // 按照格式替换
    format = format.replace(content, year.toString().slice(-content.length));
  }

  let o = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };

  for (let key in o) {
    let reg = new RegExp(`(${key}+)`);

    if (reg.test(format)) {
      //获取组匹配的内容
      let groupContent = RegExp.$1;
      // 替换
      format = format.replace(groupContent, o[key] >= 10 ? o[key] : groupContent.length == 2 ? '0' + o[key] : o[key]);
    }
  }
  // 
  return format;
})


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
