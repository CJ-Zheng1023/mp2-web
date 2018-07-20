import GLOBAL from '../../config/global'
export default {
  cacheIpc (ipc) {
    ipc = ipc.replace(/-/g, '/')
    let cache = window.localStorage.getItem('history_ipcs')
    if (!cache) {
      cache = []
    } else {
      cache = cache.split(',')
    }
    if (!cache.includes(ipc)) {
      if (cache.length === GLOBAL.HISTORY_IPCS_MAX_COUNT) {
        cache.pop()
      }
      cache.splice(0, 0, ipc)
      window.localStorage.setItem('history_ipcs', cache.join(','))
    }
  }
}
