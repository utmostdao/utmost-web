import { ethers } from 'ethers'
import type { Route } from 'vue-router'
import { Decimal } from 'decimal.js'
import { hexValue } from 'ethers/lib/utils'
import dayjs from 'dayjs'
import { Network } from '~/plugins/helpers'
import { CHAIN_TOKENS, CUSTOM_TOKENS } from '~/utils/constants'
import { SwapTokens } from '~/types/swagger'

export function customTokens(chainId?: string) {
  const localeTokensJson = localStorage.getItem(CUSTOM_TOKENS)
  let chainObj
  if (localeTokensJson) {
    chainObj = JSON.parse(localeTokensJson)
  }
  return {
    set: (token: SwapTokens['items'][0]) => {
      if (!chainId) return
      const tokens: SwapTokens['items'] = chainObj?.[chainId] ?? []

      if (!tokens.find((item) => item.swapTokenID === token.swapTokenID)) {
        tokens.push(token)
      }

      if (chainObj) {
        chainObj[chainId] = tokens
      } else {
        chainObj = { [chainId]: tokens }
      }

      localStorage.setItem(CUSTOM_TOKENS, JSON.stringify(chainObj))
    },
    get: (): SwapTokens['items'] => {
      if (!chainId) return []
      return chainObj?.[chainId] ?? []
    },
    getAll: (): { [key: string]: SwapTokens['items'] } | undefined => {
      return chainObj
    },
    delete: (token: SwapTokens['items'][0]): boolean => {
      if (!chainId) return false
      if (chainObj) {
        const tokens: SwapTokens['items'] = chainObj[chainId] ?? []
        const i = tokens.findIndex(
          (item) =>
            item.swapTokenContractAddress === token.swapTokenContractAddress
        )

        if (i !== -1) {
          tokens.splice(i, 1)
          chainObj[chainId] = tokens
          localStorage.setItem(CUSTOM_TOKENS, JSON.stringify(chainObj))
          return true
        } else {
          return false
        }
      }
      return false
    },
  }
}

export function tokenCaches(chainID: number): {
  set: (tokens: SwapTokens['items'], pageNo: number) => void
  get: (pageNo: number) => SwapTokens['items']
} {
  const localeTokensJson = localStorage.getItem(CHAIN_TOKENS)
  const tokenObj = localeTokensJson ? JSON.parse(localeTokensJson) : {}
  const localeTokensPages: any[] = tokenObj[chainID] ?? {}

  return {
    set: (tokens, pageNo) => {
      localeTokensPages[pageNo] = tokens
      tokenObj[chainID] = localeTokensPages
      localStorage.setItem(CHAIN_TOKENS, JSON.stringify(tokenObj))
    },
    get: (pageNo: number) => {
      return localeTokensPages[pageNo] ?? []
    },
  }
}

export function generateImgUrl(url?: string): string {
  if (!url) return ''
  if (!url.startsWith('http')) return url
  return 'https://oversea-proxy.safematrix.io/' + url
}

export function shortFloatNum(i: number | string, position: number): string {
  if (!i) return i?.toString() ?? '0'
  const str = i.toString().split('.')
  const s1 = str?.[0] || 0
  const s2 = str[1]?.substring(0, position) || 0

  const num = Number(`${s1}.${s2}`)

  // 统一小于0时返回0
  if (num < 0) {
    return '0'
  } else {
    return num.toString()
  }
}

export function parsePath(
  path: string,
  upperFirstCase: boolean | undefined = false
) {
  let pathList = path.replace(/"/g, '').split('/')
  pathList = pathList.reduce(
    (p: string[], c: string) => [...p, ...c.split(':')],
    []
  )
  pathList = pathList.reduce(
    (p: string[], c: string) => [...p, ...c.split('-')],
    []
  )
  if (upperFirstCase) {
    return pathList
      .slice(1)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join('')
  }
  return (
    pathList[1] +
    pathList
      .slice(2)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join('')
  )
}

export function equalPath(route: Route, name: string) {
  const routeName = route.name?.split('__')[0].split('-')[0]
  return routeName === name
}

export function equalRoute(route: Route, name: string) {
  const routeName = route.name?.split('__')[0]
  return routeName === name
}

export function toHexString(value: number | undefined | string) {
  if (!value) return '0x'
  try {
    return hexValue(ethers.BigNumber.from(value))
  } catch (error) {
    return '0x'
  }
}

export function shortAddress(address: string, num?: number) {
  if (!address) return ''
  return (
    address.substring(0, num ?? 4) +
    '...' +
    address.substring(address.length - (num ?? 4))
  )
}

export function getDecimalBalance(
  balance: string,
  decimal: string | undefined
) {
  const dec = Decimal.pow(10, Number(decimal))
  const value = new Decimal(balance)
  // const res = value.dividedBy(dec).toFixed(6)
  const val = value.dividedBy(dec)
  const hex = Decimal.pow(10, 6)
  const mid = new Decimal(parseInt(val.mul(hex).toString()))
  const res = mid.dividedBy(hex)
  return Number(res)
}

export function getPrice(gasPrice: string, gasCost: number) {
  const price = new Decimal(gasPrice)
  const cost = new Decimal(gasCost)
  const res = price.mul(cost).dividedBy('1e9').toFixed(6)
  return res
}

export function getGasValue(gasPrice: string, gasRate: string) {
  const price = new Decimal(gasPrice)
  const rate = new Decimal(gasRate)
  const res = price.mul(rate).toFixed(6)
  return res
}

export function divideDecimal(value: number, decimal: string) {
  const val = new Decimal(value)
  const dec = new Decimal(decimal)
  const ten = new Decimal(10)
  const res = val.dividedBy(ten.toPower(dec))
  return res
}

export function multiDecimal(value: string, decimal: string, hex?: boolean) {
  const val = new Decimal(value)
  const dec = new Decimal(decimal)
  const ten = new Decimal(10)
  const res = val.mul(ten.toPower(dec))
  if (hex) {
    return res.toHex()
  }
  return res.toString()
}

export function getExchangeRate(fromValue: number, toValue: number) {
  const from = new Decimal(fromValue)
  const to = new Decimal(toValue)
  const res = to.dividedBy(from)
  return res
}

export function getOriginValue(value: number) {
  const val = new Decimal(value)
  const res = val.mul('1e18')
  return res
}

export function getPriorityFee(gasPrice: string, baseFee: string) {
  const price = new Decimal(gasPrice)
  const base = new Decimal(baseFee)
  const res = price.sub(base).mul('1e9')
  return res
}

export function getGasPrice(gasPrice: string) {
  const price = new Decimal(gasPrice)
  const res = price.mul('1e9')
  return res
}

export function getMaxFeePerGas(gasPrice: string, baseFee: string) {
  const price = new Decimal(gasPrice)
  const base = new Decimal(baseFee)
  const res = price.add(base).mul('1e9')
  return res
}

export function getFixedBalance(balance: string) {
  const bal = new Decimal(balance)
  const hex = Decimal.pow(10, 6)
  const mid = new Decimal(parseInt(bal.mul(hex).toString()))
  const res = mid.dividedBy(hex)
  return Number(res)
}

export function getETHBalance(balance: string) {
  const bal = new Decimal(balance)
  const res = bal.div('1e18')
  return Number(res)
}

export function getCrossGas(gasPrice: string, gasAmount: string) {
  const price = new Decimal(gasPrice)
  const amount = new Decimal(gasAmount)
  const res = price.mul(amount).dividedBy('1e9').toFixed(6)
  return Number(res)
}

export const getDate = (time: string) => {
  return dayjs(Number(time)).format('YYYY-MM-DD HH:mm:ss')
}

export const fixNumber = (value: string) => {
  return Number(Number(value).toFixed(2)).toLocaleString('en-US')
}

export const generateBitcoinData = (network: Network, address: string) => {
  const chainId = network.chainId.toString(16).padStart(8, '0')
  if (address.startsWith('0x')) address.slice(2)
  const fullAddress = address.startsWith('0x')
    ? address.slice(2).padStart(64, '0')
    : address.padStart(64, '0')
  return chainId + fullAddress
}

export const getNetworkLogo = (name?: string) => {
  switch (name) {
    case 'eth':
    case 'eht_goerli':
    case '0x1':
    case '0x5':
      return require('assets/img/EthLogo.png')
    case 'bsc':
    case 'bsc_chapel':
    case '0x38':
    case '0x61':
      return require('assets/img/BSCLogo.png')
    case 'polygon':
    case 'polygon_mumbai':
    case '0x89':
    case '0x13881':
      return require('assets/img/PolygonLogo.png')
    case 'optimism':
    case 'optimism_goerli':
    case '0xa':
    case '0x1a4':
      return require('assets/img/OPLogo.png')
    case 'btc':
    case 'bitcoin':
    case 'btc_testnet':
      return require('assets/img/Bitcoin.png')
    case 'solana':
    case 'solana_devnet':
      return require('assets/img/Solana.png')
    default:
      return require('assets/img/EthLogo.png')
  }
}
