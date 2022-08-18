<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="current">
          <el-tab-pane label="登录账户设置" name="login">
            <login-set :user-detail="userDetail"></login-set>
          </el-tab-pane>
          <el-tab-pane label="个人详情" name="more">
            <user-info :user-detail="userDetail"></user-info>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
import LoginSet from './components/login-setting.vue'
import UserInfo from './components/user-info.vue'

import { getUserDetailByIdAPI } from '@/api/user'
export default {
  components: {
    LoginSet,
    UserInfo
  },
  data () {
    return {
      current: 'more',
      userDetail: {}
    }
  },
  created () {
    this.getUserDetail()
  },
  methods: {
    async getUserDetail () {
      const res = await getUserDetailByIdAPI(this.$route.params.id)
      // console.log(res)
      this.userDetail = res
    }
  }
}
</script>

