<template>
  <div class="employees-container">
    <div class="app-container">
      <!-- 放置表单 -->
      <el-form ref="fm" label-width="60px" :rules="rules" :model="userDetail">
        <el-form-item label="姓名" prop="username">
          <el-input
            v-model="userDetail.username"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="userDetail.password"
            disabled
            type="password"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="upadateUser">更新</el-button>
          <el-button>返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { saveUserDetailById } from '@/api/employees'
export default {
  props: {
    userDetail: {
      type: Object,
      default: () => ({})
    }

  },
  data () {
    return {
      rules: {
        // 用户名
        username: [{ required: true, message: '用户名必填！', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async upadateUser () {
      try {
        await this.$refs.fm.validate()
        await saveUserDetailById(this.userDetail)
        this.$message.success('更新成功')
        this.$router.back()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
