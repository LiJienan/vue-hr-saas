import request from '@/utils/request'
/**
 *登录接口
 * @param {object} data {mobile,password}
 * @returns
 */
export function loginAPI (data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
// 获取用户信息
export function getInfoAPI () {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
/**
 * 获取用户详细信息接口
 * @description: 获取用户头像
 * @param {*} id 用户id
 * @return {*}
 */
export function getUserDetailByIdAPI (id) {
  return request({
    url: `/sys/user/${id}`

  })
}

export function logout () {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
