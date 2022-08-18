import pageTool from './pageTool'
import UploadExcel from './UploadExcel'
import UploadImg from './UploadImg'
const cps = [pageTool, UploadExcel, UploadImg]
export default {
  install (Vue) {
    cps.forEach(cp => Vue.component(cp.name, cp))
  }
}
