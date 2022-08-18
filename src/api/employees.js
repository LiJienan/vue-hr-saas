import request from '@/utils/request'

/**
 * @description: 获取下拉选择部门负责人数据
 * @param {*}
 * @return {*}
 */
export function getEmployeeSimpleAPI () {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 * @description: 获取员工列表
 * @param {*} params {page:当前页,size：每页条数}
 * @return {*}
 */
export function getEmployeeListAPI (params) {
  return request({
    method: 'get',
    url: '/sys/user',
    params
  })
}
/**
 * @description: 删除角色
 * @param {*} id 角色id
 * @return {*}
 */
export function deleteRoleAPI (id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}
/**
 * @description: 添加员工
 * @param {*} data
 * @return {*}
 */
export function addEmployeeAPI (data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}
/**
 * @description: 导入excel批量添加员工
 * @param {*} data 包含员工信息的数组
 * @return {*}
 */
export function importEmployees (data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}
/**
 * @description: 保存员工信息
 * @param {*} data
 * @return {*}
 */
export function saveUserDetailById (data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}
