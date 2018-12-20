import axios from '../../config/axios'
const MODULE_CONTEXT = '/patent'
export default {
  namespaced: true,
  state () {
    return {
      compResult: '',
      pagination: '',
      selfpatentBaseInfo: '',
      citepatentBaseInfo: '',
      patentChaiCiTi: '',
      citedChaiCiTi: '',
      patentCLMSChaiCiTi: '',
      patentDESCChaiCiTi: '',
      citedCLMSChaiCiTi: '',
      citedDESCChaiCiTi: '',
      patentMarkList: '',
      citedPatentMarkList: '',
      sortByKeywordFreqsList: '',
      showPatentLocationList: []
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
      state.patentChaiCiTi = data.patentChaiCiTi
      state.citedChaiCiTi = data.citedChaiCiTi
      state.patentCLMSChaiCiTi = data.patentCLMSChaiCiTi
      state.patentDESCChaiCiTi = data.patentDESCChaiCiTi
      state.citedCLMSChaiCiTi = data.citedCLMSChaiCiTi
      state.citedDESCChaiCiTi = data.citedDESCChaiCiTi
    },
    showPatentMarkList (state, data) {
      state.patentMarkList = data.patentMarkList
      state.citedPatentMarkList = data.citedPatentMarkList
    },
    showSortByKeywords (state, data) {
      state.sortByKeywordFreqsList = data.sortByKeywordFreqsList
    },
    removeFlag (state, data) {
      state.removeErrorKeyWordFlag = data.removeErrorKeyWordFlag
    },
    showPatentLocation (state, data) {
      state.showPatentLocationList = data.data
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
    },
    showPatentMarkList ({commit}, {an, citedAn}) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/keyword/search/${an}/${citedAn}?token=${window.localStorage.getItem('token')}`).then(response => {
          commit('showPatentMarkList', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    },
    searchPatentDetailUnion ({commit}, {an, citedAn}) {
      return new Promise((resolve, reject) => {
        axios.all([
          axios.get(MODULE_CONTEXT + `/search/list/${an}/${citedAn}?token=${window.localStorage.getItem('token')}`),
          axios.get(MODULE_CONTEXT + `/keyword/search/${an}/${citedAn}?token=${window.localStorage.getItem('token')}`)
        ]).then(axios.spread((patentDetailResponse, markListResponse) => {
          commit('searchCompDetail', patentDetailResponse.data)
          commit('showPatentMarkList', markListResponse.data)
          resolve()
        })).catch(e => {
          console.log(e)
        })
      })
    },
    addPatentMarks ({commit, dispatch}, {an, marks, citedmarks}) {
      let markList = JSON.parse(JSON.stringify(marks))
      return new Promise((resolve, reject) => {
        axios({
          url: MODULE_CONTEXT + '/keyword/save',
          method: 'post',
          data: {
            markList: JSON.stringify(markList),
            citedMarkList: JSON.stringify(citedmarks),
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
    sortByKeywordFreqs ({commit, dispatch}, {text}) {
      return new Promise((resolve, reject) => {
        axios({
          url: MODULE_CONTEXT + '/keyword/searchTextKeyword',
          method: 'post',
          data: {
            text: text
          },
          params: {
            token: window.localStorage.getItem('token')
          }
        }).then(response => {
          commit('showSortByKeywords', response.data)
          resolve(response.data)
        }).catch(e => {
          console.log(e)
        })
      })
    },
    removeErrorKeyWords ({commit, dispatch}, {key}) {
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
          commit('removeFlag', response.data)
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
    }
  }
}
