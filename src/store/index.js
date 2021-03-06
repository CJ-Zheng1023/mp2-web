import Vuex from 'vuex'
import Vue from 'vue'
import user from './modules/user'
import ipc from './modules/ipc'
import address from './modules/address'
import comp from './modules/comp'
import electrical from './modules/electrical'
import patent from './modules/patent'
import ZKPatentMark from './modules/zkPatentMark'
import fulltext from './modules/fulltext'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    userModule: user,
    ipcModule: ipc,
    addressModule: address,
    compModule: comp,
    electricalModule: electrical,
    patentModule: patent,
    zkPatentModule: ZKPatentMark,
    fullTextModule: fulltext
  }
})
