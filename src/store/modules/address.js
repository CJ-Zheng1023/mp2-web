import axios from '../../config/axios'
import province from '../../assets/scripts/province'
const MODULE_CONTEXT = '/address'
const ZIP_URL = 'http://api.avatardata.cn/PostNumber/QueryPostnumber?key=c0aaf0b9f372415ba7c50995311dabc8&postnumber='
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
    item['status'] = prov ? 1 : 0
    item['url'] = `http://api.map.baidu.com/geocoder?address=${item['address']}&output=html&src=mp2`
    item['popoverContent'] = ''
    item['popoverTitle'] = '加载中。。。'
  })
}
export default {
  namespaced: true,
  state () {
    return {
      addressMarkList: []
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
    },
    saveMark (context, marks) {
      return new Promise((resolve, reject) => {
        axios.post(MODULE_CONTEXT + `/save?token=${window.localStorage.getItem('token')}`, {
          markAddressList: JSON.stringify(marks)
        }).then(response => {
          resolve(response.data)
        }).catch(e => {
          console.log(e)
        })
      })
    },
    showAddressByZip (context, zip) {
      return new Promise((resolve, reject) => {
        axios.get(`${ZIP_URL}${zip}`).then(response => {
          resolve(response.data)
        }).catch(e => {
          console.log(e)
        })
      })
    }
  }
}
