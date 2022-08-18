import { loginAPI, getInfoAPI, getUserDetailByIdAPI } from '@/api/user'
import * as auth from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    token: auth.getToken() || null,
    // 当前登录用户数据(结合后台返回的数据类型,确定我们声明的数据类型)
    userInfo: {}
  },
  mutations: {
    // 设置token
    setToken (state, token) {
      state.token = token // 设置token
      auth.setToken(token)
    },
    // 删除token
    removeToken (state) {
      state.token = null // 删除vuex的token
      auth.removeToken()
    },
    // 设置userInfo
    /**
     *
     * @param {*} state
     * @param {*} userInfo 调用setUser传入的用户信息数据
     */
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },
    // 删除userInfo
    removeUserInfo (state) {
      state.userInfo = {}
    }
  },
  actions: {
    // 向后台请求token
    async getTokenAction ({ commit }, data) {
      const res = await loginAPI(data)
      // console.log(res)
      commit('setToken', res)
    },
    // 向后台请求获取userInfo
    async getUserInfo ({ commit }) {
      const user = await getInfoAPI()
      // console.log('请求返回的用户信息', user)
      const photo = await getUserDetailByIdAPI(user.userId)
      // console.log(photo)
      commit('setUserInfo', { ...user, ...photo })
    },
    /**
     * 退出登录
     * 删除token,清除user信息
     */
    logoutAction ({ commit }) {
      commit('removeToken')
      commit('removeUserInfo')
    }
  }
}
