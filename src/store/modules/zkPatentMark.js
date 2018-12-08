import axios from '../../config/axios'
const MODULE_CONTEXT = '/ZKPatentMark'
export default {
  namespaced: true,
  state () {
    return {
      zkPatentListResult: '',
      pagination: '',
      ZKPatentDetailInfo: '',
      ClmsChaici: '',
      ZKchaiCiList: '',
      zkmarkList: []
    }
  },
  mutations: {
    ZKPatentListMutation (state, data) {
      state.zkPatentListResult = data.zkPatentListResult
      state.pagination = data.pagination
    },
    ZKPatentDetailMutation (state, data) {
      state.ZKPatentDetailInfo = data.ZKPatentDetailInfo
      state.ClmsChaici = data.ClmsChaici
    },
    showZKTiChaiCiMutation (state, data) {
      state.ZKchaiCiList = data.ZKchaiCiList
    },
    showZKMarkList (state, data) {
      state.zkmarkList = data.zkmarkList
    }
  },
  actions: {
    searchZKPatent ({commit}) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/patent/search/list?start=0&size=10&token=${window.localStorage.getItem('token')}`).then(response => {
          commit('ZKPatentListMutation', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    },
    searchZKPatentDetail ({commit}, {an}) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/patent/search/${an}?token=${window.localStorage.getItem('token')}`).then(response => {
          commit('ZKPatentDetailMutation', response.data)
          console.log(response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    },
    searchZKTiChaiCi ({commit}, ti) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/chaici/list/${ti}?token=${window.localStorage.getItem('token')}`).then(response => {
          commit('showZKTiChaiCiMutation', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    },
    addZKMark ({commit, dispatch}, {marks, an}) {
      let markList = JSON.parse(JSON.stringify(marks))
      console.log('an' + an)
      return new Promise((resolve, reject) => {
        axios({
          url: MODULE_CONTEXT + '/keyword/save',
          method: 'post',
          data: {
            markList: JSON.stringify(markList),
            an: an
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
    showZKMarkList ({commit}, an) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/keyword/search/${an}?token=${window.localStorage.getItem('token')}`).then(response => {
          // axios.get(MODULE_CONTEXT + `/list/A08?token=${window.localStorage.getItem('token')}`).then(response => {
          commit('showZKMarkList', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    }
  }
}
