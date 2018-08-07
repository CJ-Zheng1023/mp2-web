import axios from '../../config/axios'
import province from '../../assets/scripts/province'
import GLOBAL from '../../config/global'
const MODULE_CONTEXT = '/address'
function _addFormProperties (list) {
  if (!list) {
    return
  }
  list.forEach(item => {
    let prov = province.getProvince(item['address'])
    item['marked'] = ''
    item['province'] = prov
    item['city'] = ''
    item['area'] = ''
    item['town'] = ''
    item['rule'] = ''
    item['status'] = prov ? 1 : 0
    item['url'] = `http://api.map.baidu.com/geocoder?address=${item['address']}&output=html&src=mp2`
    item['popoverContent'] = ''
    item['popoverTitle'] = '邮编'
    item['active'] = false
    item['enabled'] = true
    item['hasRule'] = false
  })
}
export default {
  namespaced: true,
  state () {
    return {
      addressMarkList: [],
      addressRuleList: [],
      addressRuleListByPage: [],
      pagination: {}
    }
  },
  getters: {
    ruleRegExp: state => {
      let s = ''
      state.addressRuleList.forEach(item => {
        s = `${s}|${item.rule.trim()}`
      })
      return new RegExp(s.substring(1).replace(/\(/g, '\\(').replace(/\)/g, '\\)'))
    }
  },
  mutations: {
    showMarking (state, data) {
      _addFormProperties(data.addressMarkList)
      state.addressMarkList = data.addressMarkList || []
    },
    search (state, data) {
      _addFormProperties(data.addressMarkList)
      state.addressMarkList = data.addressMarkList || []
    },
    queryRule (state, data) {
      state.addressRuleList = data.addressRuleList || []
    },
    queryRuleByPage (state, data) {
      state.addressRuleListByPage = data.addressRuleList || []
      state.pagination = data.pagination
    }
  },
  actions: {
    showMarkingAndRule ({commit}) {
      return new Promise((resolve, reject) => {
        axios.all([
          axios.get(MODULE_CONTEXT + `/search/marking?token=${window.localStorage.getItem('token')}`),
          axios.get(MODULE_CONTEXT + `/rule/list?token=${window.localStorage.getItem('token')}`)
        ]).then(axios.spread((markingResponse, ruleResponse) => {
          commit('showMarking', markingResponse.data)
          commit('queryRule', ruleResponse.data)
          resolve()
        })).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    },
    search ({commit}, keyword) {
      return new Promise((resolve, reject) => {
        axios.all([
          axios.get(MODULE_CONTEXT + `/search/random?token=${window.localStorage.getItem('token')}&keyword=${keyword.trim()}`),
          axios.get(MODULE_CONTEXT + `/rule/list?token=${window.localStorage.getItem('token')}`)
        ]).then(axios.spread((searchResponse, ruleResponse) => {
          commit('search', searchResponse.data)
          commit('queryRule', ruleResponse.data)
          resolve()
        })).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    },
    saveMark (context, {marks, rules}) {
      return new Promise((resolve, reject) => {
        axios.post(MODULE_CONTEXT + `/save?token=${window.localStorage.getItem('token')}`, {
          markAddressList: JSON.stringify(marks),
          addressRuleList: JSON.stringify(rules)
        }).then(response => {
          resolve(response.data)
        }).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    },
    showAddressByZip (context, zip) {
      return new Promise((resolve, reject) => {
        axios({
          url: GLOBAL.ZIP_API.url,
          method: 'get',
          params: {
            showapi_appid: GLOBAL.ZIP_API.appId,
            showapi_sign: GLOBAL.ZIP_API.signId,
            key: zip
          }
        }).then(response => {
          resolve(response.data)
        }).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    },
    queryRule ({commit}) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/rule/list?token=${window.localStorage.getItem('token')}`).then(response => {
          commit('queryRule', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    },
    queryRuleByPage ({commit}, {keyword, type, pageNumber, size}) {
      return new Promise((resolve, reject) => {
        axios.get(MODULE_CONTEXT + `/rule/list/page?token=${window.localStorage.getItem('token')}&type=${type}&keyword=${keyword}&pageNumber=${pageNumber}&size=${size}`).then(response => {
          commit('queryRuleByPage', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    },
    updateAddressRule ({commit}, {id, province, city, area, rule}) {
      let addressRule = {id, province, city, area, rule}
      return new Promise((resolve, reject) => {
        axios.post(MODULE_CONTEXT + `/rule/modify?token=${window.localStorage.getItem('token')}`, {
          addressRule: JSON.stringify(addressRule)
        }).then(response => {
          resolve(response.data)
        }).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    }
  }
}
