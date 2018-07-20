import axios from '../../config/axios'
import Vue from 'vue'
const MODULE_CONTEXT = '/mark'
export default {
  namespaced: true,
  state () {
    return {
      markList: []
    }
  },
  mutations: {
    showMarkList (state, data) {
      Vue.set(state, 'markList', data.markList)
    }
  },
  actions: {
    showMarkList ({commit}, an) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/list/${an}?token=${window.localStorage.getItem('token')}`).then(response => {
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
