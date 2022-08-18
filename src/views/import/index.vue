<template>
  <div class="import">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <div slot="header">
          <span>员工导入</span>
        </div>
        <!-- card-body -->
        <UploadExcel
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
        />
      </el-card>
    </div>
  </div>
</template>

<script>
import { importEmployees } from '@/api/employees'
import { formatExcelDate } from '@/utils'
export default {
  methods: {
    beforeUpload (file) {
      console.log('上传之前校验', file)
      // 必须返回true才会继续执行
      const isLt1m = file.size / 1024 / 1024 < 2
      if (isLt1m) {
        return true
      }
      this.$message({ type: 'warning', message: '文件大小超过2m' })
      return false
    },
    // 校验成功后 ,通过这个execl获取详细数据1
    /**
     * header excel表头
     * result 表格中的数据
     */
    async handleSuccess ({ header, results }) {
      // console.log(header, results)
      const enResults = this.transformRsults(results)
      console.log(enResults)
      const res = await importEmployees(enResults)
      console.log(res)
      this.$message.success('OK!')
      this.$router.back()
    },
    transformRsults (results) {
      /**
       * 1.因为后台的数据反悔的字段是中文 ,需要转换为英文
       * 2.返回的时间格式也需要处理
       * 3.处理好后 掉接口上传
       */
      const userMap = {
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const newResults = []
      results.forEach(item => {
        // 中文属性的item转换为英文的
        const enUser = {}
        // zhKey是英文属性名
        for (const zhKey in item) {
          // 根据zhKey结合映射关系
          const enKey = userMap[zhKey]
          if (enKey === 'timeOfEntry' || enKey === 'correctionTime') {
            // 存储英文属性名和对应的属性值
            enUser[enKey] = formatExcelDate(item[zhKey], '-')
          } else {
            enUser[enKey] = item[zhKey]
          }
        }
        newResults.push(enUser)
        // console.log(newResults)
      })
      return newResults
    }
  }
}
</script>

<style lang="
scss"
scoped
>
</style>
