import { Plugin } from '@nuxt/types'
import { $vfm } from 'vue-final-modal-types'
import type {
  ConfirmInject,
  ConfirmMessage,
  ConfirmOptions,
} from '~/types/common'

const confirmDialog: Plugin = function (_, inject) {
  const option: ConfirmOptions = { resolver: undefined, rejecter: undefined }
  const confirm = (message: ConfirmMessage) => {
    $vfm.show('confirm-dialog', message)
    return new Promise((resolve, reject) => {
      option.resolver = resolve
      option.rejecter = reject
    })
  }
  confirm.option = option
  inject('confirmDialog', confirm as ConfirmInject)
}

export default confirmDialog
