import axios from '../../config/axios'
const MODULE_CONTEXT = '/fulltext'
export default {
  namespaced: true,
  state () {
    return {
      fullTextList: '',
      pagination: {
        start: 0,
        size: 10
      }
    }
  },
  mutations: {
    searchFullTextListMutation (state, data) {
      state.fullTextList = data.fullTextList
      state.pagination = data.pagination
    }
  },
  actions: {
    searchFullTextList ({commit}, {start, size}) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/search/list?start=${start}&size=${size}&token=${window.localStorage.getItem('token')}`).then(response => {
          commit('searchFullTextListMutation', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    }
  }
}
