<template>
  <div class="departments">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <!-- 页面title -->
        <template #header>
          <!-- 用一个行列布局 -->
          <el-row>
            <el-col :span="20">
              <span>{{ company.name }}</span>
            </el-col>
            <el-col :span="4">
              <el-row type="flex" justify="end">
                <!-- 两个内容 -->
                <el-col>负责人</el-col>
                <!-- 下拉菜单 element -->
                <el-col>
                  <el-dropdown>
                    <span> 操作<i class="el-icon-arrow-down" /> </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="openAddDept()">
                        添加子部门
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
        <!-- 页面的内容 -->
        <!-- :default-expand-all="true" -->
        <el-tree
          :data="treeData"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 作用域插槽 data拿到的是每一个子节点的对象 -->
          <!--
      什么时候用到作用域插槽？父组件中如果想使用子组件中的数据进行自定义内容的渲染 (table 单元格数据渲染) 注意作用域插槽只能有一个根节点瓶  -->
          <template #default="{ data }">
            <el-row style="width: 100%">
              <el-col :span="20">
                <span>{{ data.name }}</span>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="end">
                  <!-- 两个内容 -->
                  <el-col>{{ data.manager || "--" }}</el-col>
                  <el-col>
                    <!-- 下拉菜单 element -->
                    <el-dropdown>
                      <span> 操作<i class="el-icon-arrow-down" /> </span>
                      <!-- 下拉菜单 -->
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="openAddDept(data, 1)">
                          添加子部门
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="openAddDept(data, 2)">
                          编辑部门
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="removeDeptFn(data)">
                          删除部门
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-tree>
      </el-card>
    </div>
    <!--弹层放到根元素结束之前-->
    <add-dept
      ref="addDept"
      :show-dialog="showDialog"
      :parent-dept="parentDept"
      :all-depts="allDepts"
      :type="type"
      @close-dialog="showDialog = $event"
      @refresh-dept="getTreeData"
    ></add-dept>
  </div>
</template>

<script>
import { getDepartmentsAPI, delDepartments } from '@/api/departments'
import { transformTreeData } from '@/utils'
import AddDept from '@/views/departments/components/add-dept'

export default {
  name: 'MyDepartments',
  components: { AddDept },
  data () {
    return {
      // 未经处理的后台部门数据
      allDepts: [],
      // 公司部门数据
      treeData: [],
      company: { name: '' },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      parentDept: null,
      type: '',
      showDialog: false
    }
  },
  created () {
    this.getTreeData()
  },
  methods: {
    // 获取树形数据的方法
    async getTreeData () {
      const { depts, companyName } = await getDepartmentsAPI()
      // console.table(depts)
      this.allDepts = depts
      this.treeData = transformTreeData(depts)
      this.company.name = companyName
    },
    // 删除部门的方法
    async removeDeptFn (curDept) {
      try {
        await this.$confirm(`确认删除${curDept.name}吗?`)
        if (curDept.children && curDept.children.length > 0) {
          return this.$message.error('不能直接删除父部门')
        }
        // 不是父
        await delDepartments(curDept.id)
        this.getTreeData()
        this.$message.success('成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 打开添加子部门弹窗的方法
    // parentDept 要添加的子部门父部门 => 顶级部门没有父,所以parentDept为空
    openAddDept (parentDept, type) {
      // 1.存储子部门的父部门
      // console.log('zzz', parentDept)
      this.parentDept = parentDept
      // 区分编辑还是新增
      this.type = type
      if (type === 2) {
        this.$refs.addDept.getDeptDetail(parentDept.id)
      }
      // 2.打开弹层
      this.showDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tree-node__content {
  margin: 3px 0;
  font-size: 14px;
}
</style>

