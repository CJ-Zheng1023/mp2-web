import axios from '../../config/axios'
const MODULE_CONTEXT = '/comp'
export default {
  namespaced: true,
  state () {
    return {
      compIpcResult: '',
      pagination: '',
      selfpatentBaseInfo: '',
      citepatentBaseInfo: ''
    }
  },
  mutations: {
    searchCompIpc (state, data) {
      state.compIpcResult = data.anList
      state.pagination = data.pagination
    },
    searchCompDetail (state, data) {
      state.selfpatentBaseInfo = data.thispatentBaseInfo
      state.citepatentBaseInfo = data.citepatentBaseInfo
    }
  },
  actions: {
    searchAnList ({commit}, ipc) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/search/list/${ipc}?start=0&size=10&token=${window.localStorage.getItem('token')}`).then(response => {
          commit('searchCompIpc', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    },
    searchAnListFormTwo ({commit}, {ipc, start, size}) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/search/list/${ipc}?start=${start}&size=${size}&token=${window.localStorage.getItem('token')}`).then(response => {
          commit('searchCompIpc', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    },
    searchAnDetail ({commit}, {an, citedAn}) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/search/list/${an}/${citedAn}?token=${window.localStorage.getItem('token')}`).then(response => {
          commit('searchCompDetail', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    }
  }
}
