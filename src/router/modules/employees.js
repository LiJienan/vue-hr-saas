import Layout from '@/layout'
// Layout组件中包含
export default {
  path: '/employees', // 路径
  component: Layout, // 组件
  children: [{
    name: 'employees', // 给路由规则加一个name
    path: '', // 这里当二级路由的path什么都不写的时候 表示当前路由为默认路由直接渲染对应组件
    component: () => import('@/views/employees'),
    // 路由元信息  其实就是存储数据的对象 我们可以在这里放置一些信息
    meta: {
      title: '员工管理', // 菜单标题
      icon: 'nested'
    }
  },
  {
    path: 'detail/:id',
    component: () => import('@/views/employees/detail'),
    hidden: true, // 不在左侧菜单显示
    meta: {
      title: '员工详情'
    }
  }]
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
