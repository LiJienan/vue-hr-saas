<template>
  <el-dialog
    :title="form.id?'编辑部门':'新增部门'"
    :visible="showDialog"
    width="50%"
    :before-close="closeFn"
>
    <el-form ref="fm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
          <el-option v-for="item in peoples" :key="item.id" :value="item.username" :label="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="closeFn">取 消</el-button>
    <el-button type="primary" @click="addDeptFn">{{ form.id?'修 改':'新 增' }}</el-button>
  </span>
  </el-dialog>
</template>

<script>
import { getEmployeeSimpleAPI } from '@/api/employees'
import { addDepartmentsAPI, getDepartDetailAPI, updateDepartmentsAPI } from '@/api/departments'
export default {
  name: 'AddDept',
  props: {
    showDialog: {
      type: Boolean,
      default: () => false
    },
    parentDept: {
      type: Object,
      default: () => ({})
    },
    allDepts: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const validateCode = (rule, value, cb) => {
      let flag
      if (this.form.id) {
        flag = this.allDepts.some(item => item.code === value && value !== this.form.code)
      } else {
        flag = this.allDepts.some(item => item.code === value)
      }
      if (flag) {
        cb(new Error('编码重复,请重新输入'))
      } else {
        cb()
      }
    }
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: ['blur', 'change'] },
          { validator: validateCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: ['blur', 'change'] }
        ]
      },
      peoples: []

    }
  },
  created() {
    this.getEmployeeSimple()
  },
  methods: {
    // 关闭弹层
    closeFn() {
      this.$emit('close-dialog', false)
      // 这里清空是为编辑功能做准备
      this.form = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      this.$refs.fm.resetFields()
    },
    // 点击确认按钮 新增部门
    async addDeptFn() {
      try {
        await this.$refs.fm.validate()
        // 校验通过
        if (this.form.id) {
          // 调用更新接口
          await updateDepartmentsAPI(this.form)
        } else {
          await addDepartmentsAPI({ ...this.form, pid: this.parentDept.id || '' })
        }
        // await addDepartmentsAPI({ ...this.form, pid: this.parentDept.id || '' })
        // console.log(this.parentDept.id)
        // console.log(res)
        this.$emit('refresh-dept')
        this.$message.success('操作成功')
      } catch (e) {
        console.log('校验失败', e)
      }
    },
    // 获取部门负责人数据
    async getEmployeeSimple() {
      const data = await getEmployeeSimpleAPI()
      this.peoples = data
    },
    // 获取编辑部门详情数据=>回填数据
    async getDeptDetail(id) {
      const detail = await getDepartDetailAPI(id)
      // 回填数据
      this.form = detail
    }

  }

}
</script>

<style scoped>

</style>
