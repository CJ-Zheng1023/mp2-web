import axios from 'axios'
import GLOBAL from './global'
import Vue from 'vue'
import router from '../router/index'
axios.defaults.timeout = 15000
axios.defaults.baseURL = GLOBAL.BACK_END_URL
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 403:
          window.localStorage.removeItem('token')
          window.localStorage.removeItem('userId')
          window.localStorage.removeItem('username')
          Vue.prototype.$alert('您的登录超时，请重新登录', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          }).then(action => {
            router.replace({path: '/'})
          })
          break
        default:
          Vue.prototype.$alert(`系统出了点问题。。。`, '提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
      }
    }
    return Promise.reject(error)
  }
)
export default axios
