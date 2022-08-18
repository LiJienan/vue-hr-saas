const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  // 当前登录人头像
  avatar: state => state.user.userInfo.staffPhoto,
  name: state => state.user.userInfo.username
}
export default getters
