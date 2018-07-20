import axios from '../../config/axios'
import Vue from 'vue'
const MODULE_CONTEXT = '/ipc'
export default {
  namespaced: true,
  state: {
    data () {
      return {
        ipcResult: '',
        patentList: '',
        pagination: '',
        markList: []
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
    },
    showMarkList (state, data) {
      Vue.set(state, 'markList', data.markList)
    }
  },
  actions: {
    search ({commit}, ipc) {
      return new Promise((resolve, reject) => {
        axios.all([
          // axios.get(MODULE_CONTEXT + `/search/${ipc}?token=${window.localStorage.getItem('token')}`),
          axios.get(MODULE_CONTEXT + `/search/A08?token=${window.localStorage.getItem('token')}`),
          // axios.get(MODULE_CONTEXT + `/patent/list/${ipc}?start=0&size=12&token=${window.localStorage.getItem('token')}`)
          axios.get(MODULE_CONTEXT + `/search/list/A08?start=0&size=12&token=${window.localStorage.getItem('token')}`)
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
        // axios.get(MODULE_CONTEXT + `/patent/list/${ipc}?start=${start}&size=${size}&token=${window.localStorage.getItem('token')}`).then(response => {
        axios.get(MODULE_CONTEXT + `/search/list/A08?start=${start}&size=${size}&token=${window.localStorage.getItem('token')}`).then(response => {
          commit('searchPatentList', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    },
    showMarkList ({commit}, an) {
      return new Promise((resolve, reject) => {
        // axios.get(MODULE_CONTEXT + `/list/${an}?token=${window.localStorage.getItem('token')}`).then(response => {
        axios.get(MODULE_CONTEXT + `/list/A08?token=${window.localStorage.getItem('token')}`).then(response => {
          commit('showMarkList', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    },
    deleteMark ({commit}, markId) {
      return new Promise((resolve, reject) => {
        axios({
          url: MODULE_CONTEXT + '/delete',
          method: 'post',
          data: {
            markId
          },
          params: {
            token: window.localStorage.getItem('token')
          }
        }).then(response => {
          resolve(response.data)
        }).catch(e => {
          console.log(e)
        })
      })
    },
    addMark ({commit, dispatch}, marks) {
      let markList = JSON.parse(JSON.stringify(marks))
      return new Promise((resolve, reject) => {
        axios({
          url: MODULE_CONTEXT + '/add',
          method: 'post',
          data: {
            markList: JSON.stringify(markList)
          },
          params: {
            token: window.localStorage.getItem('token')
          }
        }).then(response => {
          resolve(response.data)
        }).catch(e => {
          console.log(e)
        })
      })
    }
  }
}
