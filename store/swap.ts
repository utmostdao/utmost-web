import { ethers } from 'ethers'
import { mutationTree, getterTree, actionTree } from 'typed-vuex'
import Decimal from 'decimal.js'
import {
  SwapChainDetails,
  SwapTokens,
  SwapPreviewPost,
  SwapConfirmPostParams,
  SwapConfirmPost,
  SwapSummary,
} from '~/types/swagger'
import { ORIGIN_TOKEN, INFINITY_BALANCE } from '~/utils/constants'
import chains from '~/utils/chains'

type SwapChain = SwapChainDetails[0]
type SwapToken = SwapTokens['items'][0]
type RefreshInfo = {
  loading: boolean
  time: number
  timer?: NodeJS.Timer
}

type SwapState = {
  swapSummary?: SwapSummary
  chainList: SwapChainDetails
  fromChain?: SwapChain
  toChain?: SwapChain
  fromToken?: SwapToken
  toToken?: SwapToken
  amount?: string
  swapPreviewInfos?: SwapPreviewPost
  slippage: number
  refreshInfo: RefreshInfo
  swapConfirmInfo?: SwapConfirmPost
  balance: string
  customReceiveAddress?: string
  allowance?: number // usdt 需要
  originTokenBalance?: string
  txResults?: ethers.providers.TransactionReceipt
  errorStr?: string
  loadingMap: {
    balance: boolean
    preview: boolean
  }
}

const refreshNum = 60

const defaultState = {
  fromChain: undefined,
  toChain: undefined,
  fromToken: undefined,
  toToken: undefined,
  amount: undefined,
  swapPreviewInfos: undefined,
  swapConfirmInfo: undefined,
  slippage: 0.03,
  balance: '0.0',
  customReceiveAddress: undefined,
  allowance: undefined,
  originTokenBalance: undefined,
  txResults: undefined,
  errorStr: undefined,
}

export const state = (): SwapState => ({
  ...defaultState,
  chainList: [],
  refreshInfo: {
    loading: false,
    time: refreshNum,
    timer: undefined,
  },
  loadingMap: {
    balance: false,
    preview: false,
  },
  swapSummary: undefined,
})
export const mutations = mutationTree(state, {
  setSwapSummary: (state, info) => (state.swapSummary = info),
  setChainList: (state, list: SwapChainDetails) => (state.chainList = list),
  setFromChain: (state, chain?: SwapChain) => {
    state.fromChain = chain
    state.balance = '0.0'
    state.amount = undefined
    state.swapPreviewInfos = undefined
  },
  setToChain: (state, chain?: SwapChain) => {
    state.toChain = chain
    // state.amount = undefined
    state.swapPreviewInfos = undefined
  },
  setFromToken: (state, token?: SwapToken) => (state.fromToken = token),
  setToToken: (state, token?: SwapToken) => (state.toToken = token),
  setAmount: (state, a?: string) => (state.amount = a),
  setSwapPreviewInfos: (state, info?: SwapPreviewPost) =>
    (state.swapPreviewInfos = info),
  setSlippage: (state, slippage: number) => (state.slippage = slippage),
  setTimerInfo: (
    state,
    {
      key,
      value,
    }: {
      key: keyof RefreshInfo
      value: boolean | number | NodeJS.Timer | undefined
    }
  ) => {
    ;(state.refreshInfo[key] as any) = value
  },
  setSwapConfirmInfo: (state, info?: SwapConfirmPost) =>
    (state.swapConfirmInfo = info),
  setBalance: (state, balance: string) => (state.balance = balance),
  setCustomReceiveAddress: (state, address?: string) =>
    (state.customReceiveAddress = address),
  setAllowance: (state, num?: number) => (state.allowance = num),
  setOriginTokenBalance: (state, amount?: string) =>
    (state.originTokenBalance = amount),
  setTxResults: (state, txResults?: any) => (state.txResults = txResults),
  setErrorStr: (state, str?: string) => (state.errorStr = str),
  setInit: (state, infos: any) => {
    Object.keys(infos).forEach((k) => {
      state[k] = infos[k]
    })
  },
  setLoadingMap: (
    state,
    {
      key,
      value,
    }: {
      key: keyof SwapState['loadingMap']
      value: boolean
    }
  ) => {
    ;(state.loadingMap[key] as any) = value
  },
})
export const getters = getterTree(state, {
  // userAddress: () => {
  //   return
  // }, //'0x4ECC3c067f3c960FA455374B0188244EF9Dc0B0e'
  fromAmountToLegal: (state): string => {
    return new Decimal(state.amount ?? 0)
      .mul(new Decimal(state.swapPreviewInfos?.srcUsdExchange ?? '0'))
      .toString()
  },
  toAmountToLegal: (state): string => {
    const _amount = new Decimal(
      state.swapPreviewInfos?.expectedReturnAmount ?? '0'
    )
    const legal = new Decimal(state.swapPreviewInfos?.dstUsdExchange ?? '0')

    return _amount.mul(legal).toString()
  },
  // 起始链代币是否为原生币
  isOriginToken: (state): boolean => {
    return (
      state.fromToken?.swapTokenContractAddress?.toLowerCase() === ORIGIN_TOKEN
    )
  },
  isSameChain: (state) => {
    const { fromChain, toChain } = state

    return fromChain?.chainID === toChain?.chainID
  },
  // 账户余额是否满足
  isEnoughBalance: (state, getters) => {
    const { originTokenBalance, swapPreviewInfos, balance, amount } = state
    const { isOriginToken } = getters

    if (isOriginToken) {
      const msgFee = new Decimal(swapPreviewInfos?.msgFee ?? '0')
      const _minAmount = new Decimal(amount ?? '0').add(msgFee)

      return new Decimal(originTokenBalance ?? '0').gte(_minAmount)
    } else {
      return new Decimal(balance ?? '0').gte(new Decimal(amount ?? '0'))
    }
  },
  /// 起始链原生币是否满足交易要求
  isEnoughBridgeFee: (state, getters) => {
    const { originTokenBalance, swapPreviewInfos } = state
    const { isOriginToken, isEnoughBalance } = getters

    if (isOriginToken) {
      return isEnoughBalance
    } else {
      const msgFee = new Decimal(swapPreviewInfos?.msgFee ?? '0')
      return new Decimal(originTokenBalance ?? '0').gte(msgFee)
    }
  },
  errStr: (state, getters) => {
    const {
      amount,
      balance,
      swapPreviewInfos,
      originTokenBalance,
      fromChain,
      errorStr,
    } = state
    const { isOriginToken, isSameChain } = getters

    if (errorStr) return errorStr
    const origin = Object.values(chains).find(
      (item) => item.chainId === Number(fromChain?.chainID ?? '')
    )

    const srcAmount = new Decimal(amount ?? '0')
    const srcBalance = new Decimal(balance ?? '0')
    // src 代币
    if (srcAmount.gt(srcBalance)) {
      return 'Insufficient Balance'
    }

    if ((amount ?? false) && (balance ?? false)) {
      // src 原生币
      if (isOriginToken && swapPreviewInfos) {
        const { msgFee } = swapPreviewInfos
        const msgFeeDec = new Decimal(msgFee)
        if (srcAmount.add(msgFeeDec).gt(srcBalance)) {
          return `At least ${srcAmount.add(msgFeeDec)} ${origin?.symbol}`
        }
      }

      // bridge fee
      if (!isSameChain && (originTokenBalance ?? false) && swapPreviewInfos) {
        const { msgFee } = swapPreviewInfos!
        const msgFeeDec = new Decimal(msgFee)
        if (msgFeeDec.gt(new Decimal(originTokenBalance ?? '0'))) {
          return `At least ${msgFee} ${origin?.symbol}`
        }
      }
    }
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async initData({ dispatch, commit }) {
      const _defaultState = { ...defaultState }
      commit('setInit', _defaultState)
      await dispatch('getChainDetail')
    },
    setMaxAmount({ state, getters, commit }) {
      const { isOriginToken } = getters
      if (isOriginToken) {
        // const max = new Decimal(state.balance).sub(new Decimal(state.))
      } else {
        commit('setAmount', new Decimal(state.balance).toString())
      }
    },
    switchChainAndToken({ commit, state, dispatch }) {
      const _fromChain = state.fromChain && { ...state.fromChain }
      const _fromToken = state.fromToken && { ...state.fromToken }

      if (!(_fromChain || state.toChain)) return

      commit('setFromChain', state.toChain)
      commit('setFromToken', state.toToken)
      commit('setToChain', _fromChain)
      commit('setToToken', _fromToken)
      dispatch('refreshData')
    },
    setTimer({ state, dispatch, commit, getters }) {
      const { fromChain, toChain } = state
      if (!(fromChain && toChain)) return
      const refreshInfo = state.refreshInfo

      if (!(getters.isEnoughBalance && getters.isEnoughBridgeFee)) {
        if (refreshInfo.timer) {
          dispatch('removerTimer')
        }
        return
      }

      if (refreshInfo.timer) {
        dispatch('removerTimer')
      }

      commit('setTimerInfo', {
        key: 'timer',
        value: setInterval(() => {
          commit('setTimerInfo', { key: 'time', value: refreshInfo.time - 1 })
          if (refreshInfo.time === 0) {
            commit('setTimerInfo', { key: 'time', value: refreshNum })
            dispatch('refreshData')
          }
        }, 1000),
      })
    },
    removerTimer({ state, commit }) {
      const refreshInfo = state.refreshInfo
      if (refreshInfo.timer) {
        clearInterval(refreshInfo.timer)

        commit('setTimerInfo', { key: 'timer', value: undefined })
        commit('setTimerInfo', { key: 'time', value: refreshNum })
      }
    },
    async refreshData({ dispatch, commit, state }) {
      const { fromChain, amount, errorStr } = state

      try {
        if (fromChain) {
          const chianID = `0x${Number(fromChain!.chainID).toString(16)}`
          const walletChain = this.app.$accessor.wallet.activeEvmWallet
          // 切换网络
          if (chianID !== walletChain?.chainId) {
            const result = await this.app.$accessor.wallet.changeNetwork(
              chianID
            )
            if (result === false) {
              throw new Error(this.$i18n.t('changeNetworkErr').toString())
            }
          }
        }

        dispatch('removerTimer')
        commit('setTimerInfo', { key: 'loading', value: true })
        await dispatch('getBalance')
        await dispatch('getSwapPreviewInfos')

        commit('setErrorStr', undefined)
      } catch (err) {
        if (err instanceof Error) {
          const errs = err.message?.split?.('(')
          commit('setErrorStr', errs?.[0] ?? err.message)
        }
      } finally {
        commit('setTimerInfo', { key: 'loading', value: false })
        if (amount && fromChain && !errorStr) {
          dispatch('setTimer')
        }
      }
    },
    async getSwapSummary({ commit }) {
      const address =
        this.app.$accessor.wallet.activeEvmWallet?.accounts[0].address
      if (!address) return
      const swapSummary = await this.app.$api.yapi.swapSummary({
        userAddress: address,
      })
      commit('setSwapSummary', swapSummary)
      return swapSummary
    },
    async getBalance({ state, commit, dispatch, getters }) {
      const { fromToken, fromChain } = state

      const userAddress =
        this.app.$accessor.wallet.activeEvmWallet?.accounts[0].address

      if (!(fromChain && fromToken && userAddress)) {
        return
      }

      let isOriginSuccess = false
      let isErc20Success = false
      try {
        commit('setLoadingMap', { key: 'balance', value: true })
        const origin = await this.app.$onboard.getBalance({
          chainId: Number(fromChain!.chainID!),
          contractAddress: ORIGIN_TOKEN,
          userAddress: userAddress!,
          decimals: 18,
        })
        commit('setOriginTokenBalance', origin)
        if (!getters.isEnoughBridgeFee) {
          dispatch('removerTimer')
        }
        isOriginSuccess = true

        const erc20 = await this.app.$onboard.getBalance({
          chainId: Number(fromChain!.chainID!),
          contractAddress: fromToken?.swapTokenContractAddress!,
          userAddress: userAddress!,
          decimals: Number(fromToken!.swapTokenDecimals!),
        })
        commit('setBalance', erc20)

        if (!getters.isEnoughBalance) {
          dispatch('removerTimer')
        }

        isErc20Success = true
      } catch (err) {
        if (!isOriginSuccess) {
          commit('setOriginTokenBalance', '0.0')
        }

        if (!isErc20Success) {
          commit('setBalance', '0.0')
        }
        throw err
      } finally {
        commit('setLoadingMap', { key: 'balance', value: false })
      }
    },
    async getChainDetail({ commit }) {
      const res = await this.app.$api.yapi.swapChainDetails({})
      commit('setChainList', res)
    },
    /**
     *
     * @param {useLoading} // ture 会赋值loadingMap,使用全局状态loading, 反之无
     */
    async getSwapPreviewInfos(
      { commit, state, dispatch },
      info: { useLoading: boolean } | undefined
    ) {
      const { useLoading = true } = info ?? {}
      const {
        fromChain,
        fromToken,
        toChain,
        toToken,
        amount,
        slippage,
        customReceiveAddress,
      } = state

      if (!amount) {
        commit('setSwapPreviewInfos', undefined)
      }

      if (!(fromChain && fromToken && toChain && toToken && amount)) return
      // commit('setSwapPreviewInfos', undefined)'
      const r = this.$router.currentRoute.query.r
      const userAddress =
        this.app.$accessor.wallet.activeEvmWallet?.accounts[0].address
      const params = {
        dstNetwork: toChain.swapNetwork,
        dstUserAddress: customReceiveAddress || userAddress!,
        dstTokenAddress: toToken.swapTokenContractAddress!,

        srcNetwork: fromChain.swapNetwork,
        srcUserAddress: userAddress!,
        srcTokenAddress: fromToken.swapTokenContractAddress!,
        srcAmount: amount,
        slippage,
        referralCode: r ? Number('0x' + r).toString() : undefined,
      }

      try {
        if (useLoading) {
          commit('setLoadingMap', { key: 'preview', value: true })
        }
        const res = await this.app.$api.yapi.swapPreviewPost(params as any)
        if (res && res.msgFee) {
          res.msgFee = ethers.utils.formatUnits(res.msgFee, 18)
        }
        commit('setSwapPreviewInfos', res)
      } catch (err) {
        commit('setSwapPreviewInfos', undefined)
        dispatch('removerTimer')
        throw err
      } finally {
        commit('setLoadingMap', { key: 'preview', value: false })
      }
    },
    async confirmSwapInfo({ state, commit }) {
      const {
        fromChain,
        fromToken,
        toChain,
        toToken,
        swapPreviewInfos,
        amount,
        slippage,
        customReceiveAddress,
      } = state
      if (!(fromChain || fromToken || toChain || toToken || swapPreviewInfos)) {
        return
      }

      const { dstRouterName, srcRouterName, interTokenSymbol } =
        swapPreviewInfos!
      const userAddress =
        this.app.$accessor.wallet.activeEvmWallet?.accounts[0].address
      const r = this.$router.currentRoute.query.r as string | undefined
      const params: SwapConfirmPostParams = {
        srcNetwork: fromChain!.swapNetwork!,
        dstNetwork: toChain!.swapNetwork!,
        srcRouterName,
        dstRouterName,
        interTokenSymbol,
        srcUserAddress: userAddress!,
        dstUserAddress: customReceiveAddress || userAddress!,
        srcTokenAddress: fromToken!.swapTokenContractAddress!,
        srcAmount: amount!,
        dstTokenAddress: toToken!.swapTokenContractAddress!,
        slippage,
        referralCode: r ? Number('0x' + r).toString() : undefined,
      }
      const res = await this.app.$api.yapi.swapConfirmPost(params)
      commit('setSwapConfirmInfo', res)
    },
    async checkTokenIsNeedApprove({ state, commit }): Promise<boolean> {
      const { fromToken, amount, swapPreviewInfos } = state
      const token = fromToken
      const balance = this.app.$helpers.multiDecimal(
        amount!.toString(),
        token!.swapTokenDecimals!,
        true
      )
      const approve = await this.app.$accessor.wallet.checkToken({
        address: fromToken!.swapTokenContractAddress!,
        balance,
        contractAddress: swapPreviewInfos!.to,
      })

      commit(
        'setAllowance',
        Number(ethers.utils.formatUnits(approve, token?.swapTokenDecimals))
      )

      if (new Decimal(approve).gte(new Decimal(balance))) {
        return true
      }
      return false
    },
    async approveToken(
      { state, commit, dispatch },
      { maxAllowance }: { maxAllowance: boolean }
    ) {
      const { fromToken, amount, swapPreviewInfos, allowance } = state

      if (!(fromToken || swapPreviewInfos)) return

      const isUsdt = fromToken?.swapThirdPartySymbol === 'USDT'
      const isClean = isUsdt ? allowance && allowance > 0 : false

      const contractAddress = swapPreviewInfos!.to
      const decimal = fromToken!.swapTokenDecimals!
      const value = this.app.$helpers.multiDecimal(
        isClean ? '0' : amount!.toString(),
        decimal?.toString(),
        true
      )
      const authorizedInfo = {
        address: fromToken?.swapTokenContractAddress!,
        value: maxAllowance ? INFINITY_BALANCE : value,
        contractAddress,
      }

      const res = await this.app.$accessor.wallet.approveToken(authorizedInfo)
      const waitRes = await res.wait()
      if (waitRes.status === 1) {
        commit('setAllowance', undefined)

        if (isClean) {
          await dispatch('approveToken', { maxAllowance })
        }
      } else {
        throw new Error('Approved failure')
      }
    },
    async sendTransaction({ state, commit, getters, dispatch }) {
      const {
        fromChain,
        fromToken,
        toChain,
        toToken,
        swapConfirmInfo,
        amount,
        swapPreviewInfos,
        slippage,
      } = state

      if (!(fromChain || swapConfirmInfo || fromToken)) return

      const chianID = `0x${Number(fromChain!.chainID).toString(16)}`
      const walletChain = this.app.$accessor.wallet.activeEvmWallet
      // 切换网络
      if (chianID !== walletChain?.chainId) {
        const result = await this.app.$accessor.wallet.changeNetwork(chianID)
        if (result === false) {
          throw new Error(this.$i18n.t('changeNetworkErr').toString())
        }
      }

      const { to, txData, value } = swapConfirmInfo!
      const from =
        this.app.$accessor.wallet.activeEvmWallet?.accounts[0].address

      const tx = {
        to,
        from,
        data: txData,
        value,
      }

      try {
        const gasLimit = await this.app.$accessor.wallet.estimateGas(tx)
        // @ts-ignore
        tx.gasLimit = gasLimit.mul(2)
        const res = await this.app.$accessor.wallet.sendTransaction(tx)
        const waitRes = await res.wait()

        if (waitRes.status === 1) {
          commit('setTxResults', waitRes)
          this.app.$helpers.addLocalTxHistory([
            {
              swapRecordSrcNetwork: fromChain?.swapNetwork ?? '',
              swapRecordDstNetwork: toChain?.swapNetwork ?? '',
              swapRecordSrcTxHash: waitRes?.transactionHash ?? '',
              swapRecordDstTxHash: undefined ?? '',
              swapRecordTxStatus: getters.isSameChain ? 'SUCCESS' : 'PENDING',
              swapRecordUserAddress:
                this.app.$accessor.wallet.activeEvmWallet?.accounts?.[0]
                  .address ?? '',
              swapRecordID: waitRes.blockHash,
              swapRecordSrcTokenSymbol: fromToken?.swapTokenSymbol ?? '',
              swapRecordDstTokenSymbol: toToken?.swapTokenSymbol ?? '',
              swapRecordSrcAmount: amount?.toString() ?? '',
              swapRecordDstAmount: swapPreviewInfos?.expectedReturnAmount ?? '',
              swapRecordSrcTxTime: Date.now().toString() ?? '',
              swapRecordDstTxTime: '',
              swapRecordSrcTokenLogo: fromToken?.swapTokenIcon ?? '',
              swapRecordDstTokenLogo: toToken?.swapTokenIcon ?? '',
              swapRecordSlippage: slippage.toString(),
              swapRecordErrorMsg: '',
            } as any,
          ])
          dispatch('getSwapSummary')
          this.app.$api.yapi.swapConfirmcallbackPost({
            srcNetwork: fromChain!.swapNetwork!,
            hash: waitRes.transactionHash,
            confirmBusinId: swapConfirmInfo!.confirmBusinId,
          })
        } else {
          console.log('failure')
        }
      } catch (err) {
        console.log(err, 'error')

        if (err instanceof Error) {
          console.log(err, err.message)
        }
        throw err
      }
    },
  }
)
