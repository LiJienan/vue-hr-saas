import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const { success, data, message } = response.data
    if (success) {
      return data
    } else {
      Message({
        message: message,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(new Error(message))
    }
  },
  error => {
    // 状态码401,500
    console.dir(error) // for debug
    if (error.response.status === 401) {
      if (router.currentRoute.path === 'login') return
      Message({
        message: error.response.data.message,
        type: 'error',
        duration: 3 * 1000
      })
    }
    // 说明:跳转的时候携带当前出现401的页面的地质参数,目的是下次登陆成功过跳回上传访问页面
    // router.currentRoute.path 获取当前页面的地址
    // 清除vuex
    store.dispatch('user/logoutAction ')
    router.replace(`/login?redirect=${router.currentRoute.path}`)
    return Promise.reject(error)
  }
)

export default service
