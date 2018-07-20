import axios from '../../config/axios'
import Vue from 'vue'
const MODULE_CONTEXT = '/search'
export default {
  namespaced: true,
  state: {
    data () {
      return {
        ipcResult: '',
        patentList: '',
        pagination: ''
      }
    }
  },
  mutations: {
    searchIpc (state, data) {
      Vue.set(state, 'ipcResult', data.ipcResult)
    },
    searchPatentList (state, data) {
      Vue.set(state, 'patentList', data.patentList)
      Vue.set(state, 'pagination', data.pagination)
    }
  },
  actions: {
    search ({commit}, ipc) {
      return new Promise((resolve, reject) => {
        axios.all([
          axios.get(MODULE_CONTEXT + `/ipc/${ipc}?token=${window.localStorage.getItem('token')}`),
          axios.get(MODULE_CONTEXT + `/patent/list/${ipc}?start=0&size=12&token=${window.localStorage.getItem('token')}`)
        ]).then(axios.spread((ipcResponse, patentResponse) => {
          commit('searchIpc', ipcResponse.data)
          commit('searchPatentList', patentResponse.data)
          resolve()
        })).catch(e => {
          console.log(e)
        })
      })
    },
    searchPatentList ({commit}, {ipc, start, size}) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/patent/list/${ipc}?start=${start}&size=${size}&token=${window.localStorage.getItem('token')}`).then(response => {
          commit('searchPatentList', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    }
  }
}
