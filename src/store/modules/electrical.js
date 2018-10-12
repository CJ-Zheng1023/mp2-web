import axios from '../../config/axios'
const MODULE_CONTEXT = '/electrical'
export default {
  namespaced: true,
  state () {
    return {
      patentListResult: '',
      patentInfoDetail: '',
      pagination: '',
      patentInfo: '',
      markTiList: '',
      chaiCiList: ''
    }
  },
  mutations: {
    searchAnListMutation (state, data) {
      state.patentListResult = data.patentList
      state.pagination = data.pagination
    },
    searchPatentDetailMutation (state, data) {
      state.patentInfoDetail = data.patentInfo
    },
    showMarkTiListMutation (state, data) {
      state.markTiList = data.markTiList
    },
    showChaiCiMutation (state, data) {
      state.chaiCiList = data.chaiCiList
    }
  },
  actions: {
    searchPatent ({commit}, ipc) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/search/list?start=0&size=10&token=${window.localStorage.getItem('token')}`).then(response => {
          commit('searchAnListMutation', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    },
    searchPatentFormTwo ({commit}, {start, size}) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/search/list?start=${start}&size=${size}&token=${window.localStorage.getItem('token')}`).then(response => {
          commit('searchAnListMutation', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    },
    searchPatentDetailAndMark ({commit}, {an, citedAn}) {
      return new Promise((resolve, reject) => {
        axios.all([
          axios.get(MODULE_CONTEXT + `/search/list/${an}?token=${window.localStorage.getItem('token')}`),
          axios.get(MODULE_CONTEXT + `/list/${an}/${citedAn}?token=${window.localStorage.getItem('token')}`)
        ]).then(axios.spread((detailResponse, markResponse) => {
          commit('searchPatentDetailMutation', detailResponse.data)
          commit('showMarkTiListMutation', markResponse.data)
          resolve()
        })).catch(e => {
          console.log(e)
        })
      })
    },
    searchPatentDetail ({commit}, {an}) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/search/list/${an}?token=${window.localStorage.getItem('token')}`).then(response => {
          commit('searchPatentDetailMutation', response.data)
          console.log(response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    },
    showMarkTiList ({commit}, {an, citedAn}) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/list/${an}/${citedAn}?token=${window.localStorage.getItem('token')}`).then(response => {
          commit('showMarkTiListMutation', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    },
    addTiMark ({commit, dispatch}, marks) {
      let markList = JSON.parse(JSON.stringify(marks))
      return new Promise((resolve, reject) => {
        axios({
          url: MODULE_CONTEXT + '/mark/add',
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
    },
    deleteTiMark ({commit}, marks) {
      console.log(window.localStorage.getItem('token'))
      return new Promise((resolve, reject) => {
        axios({
          url: MODULE_CONTEXT + '/mark/delete',
          method: 'post',
          data: {
            marks: JSON.stringify(marks)
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
    searchChaiCi ({commit}, ti) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/chaici/list/${ti}?token=${window.localStorage.getItem('token')}`).then(response => {
          commit('showChaiCiMutation', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    }
  }
}
