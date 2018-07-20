import Vuex from 'vuex'
import Vue from 'vue'
import user from './modules/user'
import ipc from './modules/ipc'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    userModule: user,
    ipcModule: ipc
  }
})
