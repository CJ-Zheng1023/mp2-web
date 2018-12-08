import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../components/user/Login'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../components/user/Register'),
      meta: {
        title: '注册'
      }
    },
    {
      path: '/',
      name: 'Index',
      component: () => import('../components/Index'),
      meta: {
        title: '标引平台首页',
        requireAuth: true
      }
    },
    {
      path: '/ipc',
      name: 'Ipc',
      component: () => import('../components/ipc/Ipc'),
      meta: {
        title: 'IPC标引',
        requireAuth: true
      }
    },
    {
      path: '/ipc/search/:ipc',
      name: 'Result',
      component: () => import('../components/ipc/Result'),
      meta: {
        title: 'IPC标引',
        requireAuth: true
      }
    },
    {
      path: '/address',
      name: 'Address',
      component: () => import('../components/address/Address'),
      meta: {
        title: '地址标引',
        requireAuth: true
      }
    },
    {
      path: '/notice',
      name: 'Notice',
      component: () => import('../components/notice/Notice'),
      meta: {
        title: '更新公告'
      }
    },
    {
      path: '/compSearch',
      name: 'CompIpc',
      component: () => import('../components/comp/Ipc'),
      meta: {
        title: 'IPC下案卷比对',
        requireAuth: true
      }
    },
    {
      path: '/comp/ipc/search/:ipc',
      name: 'CompResult',
      component: () => import('../components/comp/Result'),
      meta: {
        title: 'IPC下案卷比对',
        requireAuth: true
      }
    },
    {
      path: '/patent',
      name: 'PatentResult',
      component: () => import('../components/patent/Result'),
      meta: {
        title: '案卷比对',
        requireAuth: true
      }
    },
    {
      path: '/electricalSearch',
      name: 'ElectricalSearch',
      component: () => import('../components/electrical/Result'),
      meta: {
        title: '电学发明标题标引',
        requireAuth: true
      }
    },
    {
      path: '/ZKPatentMark',
      name: 'ZKPatentMark',
      component: () => import('../components/ZKPatentMark/Result'),
      meta: {
        title: '智库案卷标引',
        requireAuth: true
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title
  let token = window.localStorage.getItem('token')
  if (to.meta.requireAuth && !token) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  router.afterEach(() => {
    window.scrollTo(0, 0)
  })
  next()
})
export default router
