<template>
  <div>
    <el-form ref="fm" label-width="100px" :rules="rules" :model="userDetail">
      <!-- 用户名 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userDetail.username" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 手机号 => 不支持修改 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="手机号">
            <el-input v-model="userDetail.mobile" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 入职时间 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="入职时间">
            <el-date-picker
              v-model="userDetail.timeOfEntry"
              type="date"
              class="inputW"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="员工头像">
            <!-- 放置上传图片全局组件 -->
            <!-- <el-image :src="require('@/assets/common/head.jpg')"></el-image> -->
            <UploadImg :src.sync="userDetail.staffPhoto"></UploadImg>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 保存个人信息 -->
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="upadateUser"> 保存更新 </el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-col>
      </el-row>
    </el-form>
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
        // console.log('111', this.userDetail)
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
