import { Plugin } from '@nuxt/types'
import { Message } from 'element-ui'
import * as helperPlugin from '~/utils/helpers'
import chains from '~/utils/chains'
import { SwapRecords } from '~/types/swagger'
import { TX_HISTORY } from '~/utils/constants'

export type Network = {
  name: string
  network: string
  rpc: string
  value: string
  chainId: number
  chainType: 'EVM' | 'BITCOIN' | 'SOLANA'
  symbol: string
}

export type HelpersType = typeof helperPlugin & {
  copyText: (str: string) => void
  jumpToScan(chianId: number, tx: string): void
  addLocalTxHistory(infos: SwapRecords['items']): void
  removeLocalTxHistory(infos: { hash: string; network: string }[]): void
  generateDiffTime(seconds: number): string
  getLocalTxHistory(address: string): SwapRecords['items']
}

const helpersPlugin: Plugin = ({ i18n }, inject) => {
  function generateDiffTime(seconds: number) {
    const h = Math.trunc(seconds / 60 / 60)
    let m = 0
    const s = Math.trunc(seconds % 60)

    if (h !== 0) {
      m = Math.trunc((seconds % h) / 60)
    } else {
      m = Math.trunc(seconds / 60)
    }

    const _h = h.toString().length === 1 ? `0${h}` : h
    const _m = m.toString().length === 1 ? `0${m}` : m
    const _s = s.toString().length === 1 ? `0${s}` : s

    return `${_h}:${_m}:${_s}`
  }

  function addLocalTxHistory(infos: SwapRecords['items']) {
    const txs: SwapRecords['items'] = JSON.parse(
      localStorage.getItem(TX_HISTORY) ?? '[]'
    )

    infos.forEach((item) => {
      const info = txs.find(
        (s) =>
          item.swapRecordSrcTxHash?.toLowerCase() ===
            s.swapRecordSrcTxHash?.toLowerCase() &&
          item.swapRecordSrcNetwork === s.swapRecordSrcNetwork
      )

      if (!info) {
        txs.push(item)
      }
    })

    localStorage.setItem(TX_HISTORY, JSON.stringify(txs))
  }

  function removeLocalTxHistory(infos: { hash: string; network: string }[]) {
    const txs: SwapRecords['items'] = JSON.parse(
      localStorage.getItem(TX_HISTORY) ?? '[]'
    )

    infos.forEach((item) => {
      const i = txs.findIndex((s) => {
        return (
          s.swapRecordSrcNetwork === item.network &&
          s.swapRecordSrcTxHash?.toLowerCase() === item.hash.toLowerCase()
        )
      })

      if (i !== -1) {
        txs.splice(i, 1)
      }
    })

    localStorage.setItem(TX_HISTORY, JSON.stringify(txs))
  }

  function getLocalTxHistory(address: string) {
    const localTxsJson = localStorage.getItem(TX_HISTORY)
    return localTxsJson
      ? JSON.parse(localTxsJson).filter(
          (item) => item.swapRecordUserAddress === address
        )
      : []
  }

  function jumpToScan(chainId: number, tx: string) {
    const chainValues = Object.values(chains)

    const scanUrls = [
      ...chainValues.map((e) => {
        return {
          chainId: e.chainId,
          url: e.scanUrl,
          block: undefined,
        }
      }),
    ]
    const scanUrl = scanUrls.find((s) => s.chainId === chainId)
    if (!scanUrl) {
      throw new Error('chain not found')
    }

    const urlObj = new URL(scanUrl.url)

    const urlHref = urlObj.origin + urlObj.pathname
    const url = urlHref.endsWith('/') ? urlHref : urlHref + '/'
    const search = urlObj.search

    if ([160313568, 1918346523].includes(chainId)) {
      window.open(`${url}txblock/${tx}`)
    } else {
      window.open(`${url}tx/${tx}${search}`)
    }
  }

  async function copyText(str: string) {
    document.addEventListener('copy', (e) => {
      e.clipboardData?.setData('text/plain', str)
      e.preventDefault()
    })

    try {
      const isCopy = document.execCommand('copy')
      if (!isCopy) {
        if (!navigator.clipboard) throw Error
        await navigator.clipboard.writeText(str)
      }
      Message.success(i18n.t('copySuccess').toString())
    } catch {}
  }

  inject('helpers', {
    ...helperPlugin,
    copyText,
    jumpToScan,
    addLocalTxHistory,
    removeLocalTxHistory,
    generateDiffTime,
    getLocalTxHistory,
  } as HelpersType)
}

export default helpersPlugin
