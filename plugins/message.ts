import { Plugin } from '@nuxt/types'
import { Message } from 'element-ui'
import { ElMessage } from 'element-ui/types/message'

const message: Plugin = (_, inject) => {
  inject('message', Message as ElMessage)
}

export default message
