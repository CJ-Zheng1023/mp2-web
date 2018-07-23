import axios from '../../config/axios'
const MODULE_CONTEXT = '/address'
export default {
  namespaced: true,
  state () {
    return {
      addressMarkList: []
    }
  },
  mutations: {
    showMarking (state, data) {
      state.addressMarkList = data.addressMarkList
    },
    search (state, data) {
      state.addressMarkList = data.addressMarkList
    }
  },
  actions: {
    showMarking ({commit}) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/search/marking?token=${window.localStorage.getItem('token')}`).then(response => {
          commit('showMarking', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    },
    search ({commit}, keyword) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/search/random?token=${window.localStorage.getItem('token')}&keyword=${keyword}`).then(response => {
          commit('search', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    }
  }
}
