<template>
  <!--
 el-upload 上传组件关键属性说明
 1. action 后台地址
 2. show-file-list 是否显示上传文件列表 boolean
 3. before-upload  绑定回调 上传之前的校验
 4. on-success 调用action后台上传接口成功后 执行属性绑定的回调函数
 -->
  <el-upload
    class="avatar-uploader"
    action="#"
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="upload"
  >
    <!-- 上传成功之后图片回显 -->
    <img v-if="src" :src="src" class="avatar" />
    <!-- 默认显示的+ -->
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    <el-progress
      v-show="isShow"
      :percentage="percent"
      status="success"
    ></el-progress>
  </el-upload>
</template>

<script>
// 1. 导入Cos腾讯云sdk方法构造函数
import Cos from 'cos-js-sdk-v5'
// 2. 初始化得到云cos操作图片上传的实例
const cos = new Cos({
  SecretId: 'AKIDX7TcZJqAE6lEVbUBgx4zhBSXQ7aq5C6l',
  SecretKey: 'ThfOs64nGTTGo9GAqHSQAgwxjFVWHn39'
})
// console.log(cos)
export default {
  name: 'UploadImg',
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isShow: false,
      percent: 0
      // imageUrl: ''
    }
  },
  methods: {
    // 自定义上传的回调函数
    upload ({ file }) {
      this.isShow = true
      // console.log('开始上传', file)
      // 自己处理上传逻辑 发请求=>调用腾讯云提供的SDK
      cos.putObject({
        Bucket: 'hr-sass-1313245956', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-beijing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        StorageClass: 'STANDARD', // 存储模式=>标准模式
        Body: file, // 上传文件对象
        // 图片的上传进度数据
        onProgress: (progressData) => {
          console.log(JSON.stringify(progressData))
          this.percent = progressData.percent * 100
        }
      }, (err, data) => { // 图片上传完毕后的回调
        console.log(err || data)
        // err如果上传失败会返回错误信息  如果上传成功err的值为null
        // data 上传成功服务器返回的图片数据
        if (!err) {
          // 上传成功
          // console.log('上传成功', data)
          setTimeout(() => {
            // this.imageUrl = 'https://' + data.Location
            this.$emit('update:src', `https://${data.Location}`)
            this.percent = 0
            this.isShow = false
          }, 600)
        }
      })
    },
    // 上传之前对图片大小和格式做校验
    beforeAvatarUpload (file) {
      // 上传之前对文件类型和大小做校验
      console.log('上传之前的校验', file)
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
