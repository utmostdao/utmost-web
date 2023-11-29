import { $vfm } from 'vue-final-modal-types'
import type { ConfirmInject } from './common'
import { accessorType } from '~/store'
import { HelpersType } from '~/plugins/helpers'
import { Onboard } from '~/plugins/wallet'
import { ApiInject } from '~/plugins/api'

declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessorType
    $onboard: Onboard
    $vfm: typeof $vfm
    $confirmDialog: ConfirmInject
    $helpers: HelpersType
    $api: ApiInject
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $onboard: Onboard
    $confirmDialog: ConfirmInject
    $helpers: HelpersType
    $api: ApiInject
    $accessor: typeof accessorType
  }

  interface Context {
    $accessor: typeof accessorType
    $onboard: Onboard
    $confirmDialog: ConfirmInject
    $helpers: HelpersType
    $api: ApiInject
  }
}
