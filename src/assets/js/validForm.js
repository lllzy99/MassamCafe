import Vue from 'vue'
import { Toast } from 'vant'
Vue.use(Toast)


class ValidForm{
  constructor() {}

  valid(o) {
    // 
    // 存在不正确的就显示提示错误信息
    for(let key in o) {
      if(!o[key].reg.test(o[key].value)) {
        Toast(o[key].errMsg);
        return false;
      }
    }
    return true;
  }
}

export const validForm = new ValidForm();