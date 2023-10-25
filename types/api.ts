import type { NuxtAxiosInstance } from '@nuxtjs/axios'
import { SwapSwapRecords, SwapPools } from './crossSwagger'
import type { SwapTokens, SwapPreviewPostParams } from './swagger'
type _PageItem<T> = 'items' extends keyof T ? T['items'] : unknown

export type Item<T> = T extends (infer U)[] ? U : T
export type PageItem<T> = Item<_PageItem<T>>

export interface ApiProvider {
  axios: NuxtAxiosInstance
}

export type Token = PageItem<SwapTokens>

export type SwapPreviewParams = NonNullable<SwapPreviewPostParams>

export type FromToken = Token & {
  legalTenderExchangeRatio?: {
    CNY: string
    USD: string
  }
}

export type AuthorizedInfo = {
  address: string
  balance: string
}

export type Chain = {
  id: string
  token: string
  label: string
  rpcUrl: string
  // imgLink: NodeRequire | string
}

export type HasBalanceToken = Token & {
  balance: string
}

export type CrossToken = {
  name: string
  symbol: string
  tokenDecimals: string
  tokenContractAddress: string
  isNative: string
  anchorContractAddress: string
  id: string
  icon: string
  poolAddress: string
}

export type CrossNetwork = {
  swapNetwork: string
  chainID: string
  chainIcon: string
  tokens: CrossToken[]
}

export type SwapPoolItem = SwapPools[0]

export type CrossSwapRecords = PageItem<SwapSwapRecords>
