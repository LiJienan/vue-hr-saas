<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="close">
    <!-- 表单 -->
    <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="formData.username"
          style="width: 50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width: 50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width: 50%"
          placeholder="请选择入职时间"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width: 50%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in dictionary.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          v-model="formData.workNumber"
          style="width: 50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          style="width: 50%"
          placeholder="请选择部门"
          @focus="showTree = true"
        />
        <div class="tree-box">
          <el-tree
            v-show="showTree"
            :data="treeData"
            :props="{ label: 'name' }"
            @node-click="selectNode"
          />
        </div>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width: 50%"
          placeholder="请选择转正时间"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-button @click="$emit('update:showDialog')">取消</el-button>
      <el-button type="primary" @click="addEployeeFn">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import dictionary from '@/api/constant/employees'
// 引入api方法
import { getDepartmentsAPI } from '@/api/departments'
import { addEmployeeAPI } from '@/api/employees'
// 引入树形结构转换方法
import { transformTreeData, parseTime } from '@/utils'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showTree: false,
      treeData: [], // 定义数组接收树形数据
      dictionary,
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        timeOfEntry: '', // 入职时间
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getTreeData()
  },
  methods: {
    close () {
      this.$emit('update:showDialog')
      this.$refs.addForm.resetFields()
    },
    // 添加新员工
    async addEployeeFn () {
      try {
        await this.$refs.addForm.validate()
        // 校验通过
        console.log('success')
        this.formData.correctionTime = parseTime(this.formData.correctionTime, '{y}-{m}-{d}')
        this.formData.timeOfEntry = parseTime(this.formData.timeOfEntry, '{y}-{m}-{d}')

        const res = await addEmployeeAPI(this.formData) // 调用新增接口
        console.log(res)
        this.$message.success('添加成功')
        this.$emit('update:showDialog')
        this.$parent.getEmployeeList()
      } catch (error) {
        // 校验失败
        console.log(error)
      }
    },
    // 获取树形数据的方法
    async getTreeData () {
      const { depts } = await getDepartmentsAPI()
      this.treeData = transformTreeData(depts)
    },
    // 当前选择的节点
    selectNode (dept) {
      // console.log('当前选择', dept)
      this.formData.departmentName = dept.name
      this.showTree = false
    }
  }

}
</script>
<style lang="scss" scoped>
.tree-box {
  width: 372px;
  border: 1px solid #eee;
}
</style>
