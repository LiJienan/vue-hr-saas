<template>
  <div class="employees">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <template #header>
          <span>员工管理</span>
        </template>
        <!-- 页面的内容 -->
        <page-tool>
          <!-- 插入到left插槽位置 -->
          <template #left>
            <span>总记录数：{{ total }}条</span>
          </template>
          <!-- 插入到right插槽位置 -->
          <template #right>
            <el-button
              type="warning"
              size="small"
              @click="$router.push('/import')"
              >导入excel
            </el-button>
            <el-button
              type="danger"
              size="small"
              :loading="downloadLoading"
              @click="exportData"
            >
              导出excel
            </el-button>
            <el-button type="primary" size="small" @click="showDialog = true">
              新增员工
            </el-button>
          </template>
        </page-tool>
        <div>
          <!-- table列表 -->
          <el-table
            border
            :data="list"
            :default-sort="{ prop: 'workNumber', order: 'descending' }"
          >
            <el-table-column type="index" label="序号" />
            <el-table-column prop="username" label="姓名" />
            <el-table-column prop="workNumber" label="工号" />
            <el-table-column label="头像">
              <template #default="{ row }">
                <!-- <img :src="row.staffPhoto" alt="" width="50px" /> -->
                <el-image :src.sync="row.staffPhoto" fit="fill" class="photo" />
              </template>
            </el-table-column>
            <el-table-column label="聘用形式">
              <template #default="{ row }">
                {{ formatFormOfEmployee(row.formOfEmployment) }}
              </template>
            </el-table-column>
            <el-table-column prop="departmentName" label="部门" />
            <el-table-column
              prop="timeOfEntry"
              label="入职时间"
              :sortable="true"
            />
            <el-table-column label="账户状态">
              <el-switch v-model="qy" />
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="280">
              <template #default="{ row }">
                <el-button
                  type="text"
                  size="small"
                  @click="$router.push(`/employees/detail/${row.id}`)"
                >
                  查看
                </el-button>
                <el-button type="text" size="small">分配角色</el-button>
                <el-button type="text" size="small" @click="deleteRole(row.id)">
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
            <el-pagination
              background
              layout="prev, pager, next,sizes"
              :total="total"
              :current-page="params.page"
              :page-size="params.size"
              :page-sizes="[10, 5, 2]"
              @current-change="changePage"
              @size-change="changeSize"
            />
          </el-row>
        </div>
      </el-card>
    </div>
    <AddEmployee :show-dialog.sync="showDialog"></AddEmployee>
    <!-- $event 可以接收到子组件传来的值 -->
  </div>
</template>

<script>
import { getEmployeeListAPI, deleteRoleAPI } from '@/api/employees'
import dictionary from '@/api/constant/employees'
import AddEmployee from './components/add-employee'
export default {
  components: {
    AddEmployee
  },
  data () {
    return {
      downloadLoading: false,
      showDialog: false, // 新增员工信息弹框显示
      qy: true,
      list: [],
      total: 0,
      params: {
        page: 1,
        size: 10
      }
    }
  },
  created () {
    this.getEmployeeList()
  },
  methods: {
    // 获取员工列表
    async getEmployeeList () {
      const { rows, total } = await getEmployeeListAPI(this.params)
      // console.log(rows)
      this.list = rows
      this.total = total
    },
    // 切换页码
    changePage (pageNum) {
      // console.log(pageNum)
      this.params.page = pageNum
      this.getEmployeeList(this.params)
    },
    // 切换每页显示的条数
    changeSize (pageSize) {
      this.params.size = pageSize
      this.getEmployeeList(this.params)
    },
    // 根据字典查询对应的数字代表的含义
    formatFormOfEmployee (type) {
      const map = {}
      dictionary.hireType.forEach(item => {
        map[item.id] = item.value
      })
      return map[type]
    },
    // 删除员工
    async deleteRole (id) {
      //  提示
      try {
        await this.$confirm('确认删除吗?')
        // 只有点击了确定 才能进入到下方
        await deleteRoleAPI(id) // 调用删除接口
        if (this.list.length === 1) {
          if (this.params.page > 1) {
            this.params.page--
          }
        }
        this.getEmployeeList() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 导出某一页员工数据为excel保存在本地电脑
    async exportData () {
      // 开启loading效果
      this.downloadLoading = true
      const excel = await import('@/utils/Export2Excel')
      // console.log(excel)
      const { header, secondArray } = this.provideData()
      console.log(header, secondArray)

      excel.export_json_to_excel({
        header, // 表头
        data: secondArray, // 导出具体数据 二维数组
        filename: ` 第${this.params.page}页员工数据`,
        autoWidth: true, // cell宽度是佛自适应
        bookType: 'xlsx'// 导出文件格式
      })
      // 导出结束 关闭loading
      this.downloadLoading = false
    },
    // 提供excel表头和数据
    provideData () {
      const exportMap = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '工号': 'workNumber',
        '转正日期': 'correctionTime',
        '部门': 'departmentName'
      }
      // 表头
      const header = Object.keys(exportMap)
      // 指定要导出的属性名
      const filterKeys = Object.values(exportMap)

      const secondArray = []
      this.list.forEach(item => {
        const userInfo = []
        // 循环员工信息对象=>根据filterKeys决定导出的字段
        for (const key in item) {
          if (filterKeys.includes(key)) {
            if (key === 'formOfEmployment') {
              userInfo.push(this.formatFormOfEmployee(item[key]))
            } else {
              userInfo.push(item[key])
            }
            // 在影射关系中=>说明是需要的属性
          }
        }
        // 存到二维数组中
        secondArray.push(userInfo)
      })

      return {
        header,
        secondArray
      }
    }
    // 监听子组件传来的关闭弹窗
    //   closeDialog () {
    //     this.showDialog = false
    //   }
  }

}
</script>

<style lang="scss" scoped>
.photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
