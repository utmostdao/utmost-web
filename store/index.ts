import { getAccessorType } from 'typed-vuex'
import * as wallet from '~/store/wallet'
import * as swap from '~/store/swap'

export const accessorType = getAccessorType({
  modules: {
    wallet,
    swap,
  },
})
