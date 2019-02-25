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
      DescChaici: '',
      ZKchaiCiList: '',
      zkmarkList: [],
      removeErrorKeyWordFlag: '',
      showZKPatentLocationList: [],
      ZKPatentByAnInfo: ''
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
      state.DescChaici = data.DescChaici
    },
    ZKPatentByAnMutation (state, data) {
      state.ZKPatentByAnInfo = data.ZKPatentDetailInfo
    },
    showZKTiChaiCiMutation (state, data) {
      state.ZKchaiCiList = data.ZKchaiCiList
    },
    showZKMarkList (state, data) {
      state.zkmarkList = data.zkmarkList
    },
    removeZKFlag (state, data) {
      state.removeZKErrorKeyWordFlag = data.removeZKErrorKeyWordFlag
    },
    showPatentLocation (state, data) {
      state.showZKPatentLocationList = data.data
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
      /*  axios.get(MODULE_CONTEXT + `/chaici/list/${ti}?token=${window.localStorage.getItem('token')}`).then(response => {
          commit('showZKTiChaiCiMutation', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        }) */
        axios({
          url: MODULE_CONTEXT + '/chaici/list',
          method: 'post',
          data: {
            title: ti
          },
          params: {
            token: window.localStorage.getItem('token')
          }
        }).then(response => {
          resolve(response.data)
          commit('showZKTiChaiCiMutation', response.data)
        }).catch(e => {
          console.log(e)
        })
      })
    },
    addZKMark ({commit, dispatch}, {marks, an, invtype}) {
      console.log(invtype)
      let markList = JSON.parse(JSON.stringify(marks))
      return new Promise((resolve, reject) => {
        axios({
          url: MODULE_CONTEXT + '/keyword/save',
          method: 'post',
          data: {
            markList: JSON.stringify(markList),
            patenttype: invtype,
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
          commit('showZKMarkList', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    },
    searchZKPatentDetailUnion ({commit}, {an, title}) {
      // console.log('title111' + title)
      return new Promise((resolve, reject) => {
        axios.all([
          axios.get(MODULE_CONTEXT + `/patent/search/${an}?token=${window.localStorage.getItem('token')}`),
          axios.get(MODULE_CONTEXT + `/keyword/search/${an}?token=${window.localStorage.getItem('token')}`),
          // axios.get(MODULE_CONTEXT + `/chaici/list/${title}?token=${window.localStorage.getItem('token')}`)
          axios({
            url: MODULE_CONTEXT + '/chaici/list',
            method: 'post',
            data: {
              title: title
            },
            params: {
              token: window.localStorage.getItem('token')
            }
          })
        ]).then(axios.spread((patentDetailResponse, markListResponse, chaiCiResponse) => {
          commit('ZKPatentDetailMutation', patentDetailResponse.data)
          commit('showZKMarkList', markListResponse.data)
          commit('showZKTiChaiCiMutation', chaiCiResponse.data)
          resolve()
        })).catch(e => {
          console.log(e)
        })
      })
    },
    searchZKPatentFormTwo ({commit}, {start, size}) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/patent/search/list?start=${start}&size=${size}&token=${window.localStorage.getItem('token')}`).then(response => {
          commit('ZKPatentListMutation', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    },
    removeZKErrorKeyWords ({commit, dispatch}, {key}) {
      return new Promise((resolve, reject) => {
        axios({
          url: MODULE_CONTEXT + '/keyword/remove/key',
          method: 'post',
          data: {
            errorKeyWord: key
          },
          params: {
            token: window.localStorage.getItem('token')
          }
        }).then(response => {
          commit('removeZKFlag', response.data)
          resolve(response.data)
        }).catch(e => {
          console.log(e)
        })
      })
    },
    searchPatentLocation ({commit}, {an}) {
      return new Promise((resolve, reject) => {
        axios.get(`http://10.51.52.84:9090/sim/an?an=${an}`).then(response => {
          commit('showPatentLocation', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    },
    searchPatentByAn ({commit}, {an}) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/patent/search/${an}?token=${window.localStorage.getItem('token')}`).then(response => {
          commit('ZKPatentByAnMutation', response.data)
          console.log(response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    }
  }
}
