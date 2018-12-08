import axios from '../../config/axios'
const MODULE_CONTEXT = '/patent'
export default {
  namespaced: true,
  state () {
    return {
      compResult: '',
      pagination: '',
      selfpatentBaseInfo: '',
      citepatentBaseInfo: ''
    }
  },
  mutations: {
    searchComp (state, data) {
      state.compResult = data.anList
      state.pagination = data.pagination
    },
    searchCompDetail (state, data) {
      state.selfpatentBaseInfo = data.thispatentBaseInfo
      state.citepatentBaseInfo = data.citepatentBaseInfo
    }
  },
  actions: {
    searchPatentsList ({commit}) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/search/list?start=0&size=10&token=${window.localStorage.getItem('token')}`).then(response => {
          commit('searchComp', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    },
    searchPatentListFormTwo ({commit}, {start, size}) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/search/list?start=${start}&size=${size}&token=${window.localStorage.getItem('token')}`).then(response => {
          commit('searchComp', response.data)
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
