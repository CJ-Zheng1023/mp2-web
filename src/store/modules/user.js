import axios from '../../config/axios'
import Vue from 'vue'
const MODULE_CONTEXT = '/user'
export default {
  namespaced: true,
  state: {
    data () {
      return {
        loginCode: '',
        user: '',
        token: '',
        registerCode: ''
      }
    }
  },
  mutations: {
    login (state, data) {
      Vue.set(state, 'loginCode', data.code)
      Vue.set(state, 'user', data.user)
      Vue.set(state, 'token', data.token)
    },
    register (state, data) {
      Vue.set(state, 'registerCode', data.code)
    }
  },
  actions: {
    login: ({commit}, {username, password}) => {
      return new Promise((resolve, reject) => {
        axios.post(MODULE_CONTEXT + '/login', {
          username,
          password
        }).then(response => {
          commit('login', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    },
    register ({commit}, {username, password}) {
      return new Promise((resolve, reject) => {
        axios({
          url: MODULE_CONTEXT + '/add',
          method: 'post',
          data: {
            username,
            password
          }
        }).then(response => {
          commit('register', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
        })
      })
    },
    deleteToken () {
      return new Promise((resolve, reject) => {
        axios({
          url: MODULE_CONTEXT + '/logout',
          method: 'post',
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
