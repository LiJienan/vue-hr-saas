<template>
  <div class="setting-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="padding: 10px 0">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >
                新增角色
              </el-button>
            </el-row>
            <!-- 新增弹框 -->
            <el-dialog
              :title="roleForm.id ? '修改角色' : '新增角色'"
              :visible.sync="showDialog"
              @close="btnClose"
            >
              <el-form
                ref="roleForm"
                :model="roleForm"
                :rules="rules"
                label-width="100px"
              >
                <el-form-item label="角色名称" prop="name">
                  <el-input v-model="roleForm.name" />
                </el-form-item>
                <el-form-item label="角色描述" prop="description">
                  <el-input v-model="roleForm.description" />
                </el-form-item>
              </el-form>
              <!-- 底部 -->
              <el-row slot="footer" type="flex" justify="center">
                <el-col :span="6">
                  <el-button size="small" @click="btnClose">取消</el-button>
                  <el-button size="small" type="primary" @click="btnOK">
                    确定
                  </el-button>
                </el-col>
              </el-row>
            </el-dialog>
            <!-- 表格 -->
            <el-table :data="roleList">
              <el-table-column label="序号" width="120" type="index" />
              <el-table-column label="角色名称" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template #default="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                  >
                    编辑
                  </el-button>
                  <el-button size="small" type="danger" @click="delRole(row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                layout="prev,pager,next"
                :current-page="query.page"
                :page-size="query.pagesize"
                :total="query.total"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getRoleListAPI, deleteRoleAPI, addRole, getRoleDetailAPI, updateRoleAPI } from '@/api/setting'
export default {
  data () {
    return {
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在2-20之间', trigger: 'blur' }],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      },
      roleList: [], // 承接数组
      query: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10,
        total: 0 // 记录总数
      }
    }
  },
  created () {
    this.getRoleList()
  },

  // 获取角色列表数据
  methods: {
    async getRoleList () {
      const { total, rows } = await getRoleListAPI(this.query)
      this.query.total = total
      this.roleList = rows
    },
    // 切换分页
    changePage (pageNum) {
      console.log(pageNum)
      this.query.page = pageNum
      this.getRoleList() // 获取角色列表
    },
    // 删除角色
    async delRole (role) {
      try {
        await this.$confirm(`确认删除<${role.name}>吗?`)
        await deleteRoleAPI(role.id)

        this.$message.success('删除成功')
        if (this.roleList.length === 1) {
          if (this.query.page > 1) {
            this.query.page--
          }
        }
        this.getRoleList()
      } catch (error) {
        //
      }
    },
    // 确认提交
    async btnOK () {
      try {
        this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          await updateRoleAPI(this.roleForm)
          this.getRoleList()
          this.$message.success('修改成功')
          this.showDialog = false
        } else {
          await addRole(this.roleForm)
          // console.log(res)
          this.getRoleList()
          this.$message.success('操作成功')
          this.showDialog = false
        }
      } catch (error) {
        //
      }
    },
    // 关闭弹层
    btnClose () {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      // 关闭弹框
      this.showDialog = false
    },
    // 编辑弹框
    async editRole (id) {
      const res = await getRoleDetailAPI(id)
      // console.log('edit', res)
      this.roleForm = res
      this.showDialog = true
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
