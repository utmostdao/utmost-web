import {
  addWallet,
  // removeWallet,
  // disconnectWallet$,
  trackWallet,
  requestAccounts,
  getChainId,
} from 'web3-onboard-core'
import { BigNumber, ethers } from 'ethers'
// eslint-disable-next-line import/no-named-as-default
import EventEmitter from 'eventemitter3'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { ProviderRpcErrorCode } from '@web3-onboard/common'
import type { WalletModule } from '@web3-onboard/common'
import { mutationTree, getterTree, actionTree } from 'typed-vuex'
import type { WalletState } from 'web3-onboard-core/dist/types'
import {
  CONNECETED_ADDRESS_KEY,
  CONNECETED_WALLETS_KEY,
  REFERRER_CONTRACT,
  REFERRER_CONTRACT_TEST,
} from '~/utils'
import { crossBtcABI, erc20ABI, referrerCoreABI } from '~/utils/abi'

export type OnboardStatus = 'initial' | 'connecting' | 'authorized'

export interface ConnectedWallet {
  label: string
  icon: string
  chain: string
  accounts: { address: string }[]
  provider: any
  chainId?: string
}

export type ConnectWalletState = {
  evmWallets: ConnectedWallet[]
  activeEvmWallet?: ConnectedWallet
  bitcoinWallets: ConnectedWallet[]
  activeBitcoinWallet?: ConnectedWallet
  onboardStatus: OnboardStatus
}

export const state = (): ConnectWalletState => ({
  evmWallets: [],
  bitcoinWallets: [],
  activeEvmWallet: undefined,
  activeBitcoinWallet: undefined,
  onboardStatus: 'initial',
})

export const getters = getterTree(state, {
  evmWallets: (state: ConnectWalletState) => state.evmWallets,
  activeEvmWallet: (state) => state.activeEvmWallet,
  activeBitcoinWallet: (state) => state.activeBitcoinWallet,
  bitcoinWallet: (state) => state.bitcoinWallets,
  onboardStatus: (state) => state.onboardStatus,
  chainId: (state) => state.activeEvmWallet?.provider?.chainId,
})

export const mutations = mutationTree(state, {
  addEvmWallet: (state, wallet?: ConnectedWallet) => {
    if (wallet) {
      state.evmWallets = state.evmWallets.filter(
        (w) => w.label !== wallet.label
      )
      state.evmWallets.push(wallet)
      if (
        state.activeEvmWallet?.label === wallet.label ||
        !state.activeEvmWallet
      ) {
        state.activeEvmWallet = wallet
      }
    }
  },
  removeEvmWallet: (state, label: string) => {
    state.evmWallets = state.evmWallets.filter((w) => w.label !== label)
    if (label === state.activeEvmWallet?.label) {
      if (state.evmWallets.length > 0) {
        state.activeEvmWallet = state.evmWallets[0]
      } else {
        state.activeEvmWallet = undefined
      }
    }
  },
  removeBitcoinWallet: (state, label: string) => {
    state.bitcoinWallets = state.bitcoinWallets.filter((w) => w.label !== label)
    if (label === state.activeBitcoinWallet?.label) {
      if (state.bitcoinWallets.length > 0) {
        state.activeEvmWallet = state.bitcoinWallets[0]
      } else {
        state.activeBitcoinWallet = undefined
      }
    }
  },
  setActiveEvmWallet: (state, wallet?: ConnectedWallet) => {
    state.activeEvmWallet = wallet
  },
  setActiveWallet: (state, wallet?: ConnectedWallet) => {
    if (wallet?.chain === 'evm') {
      state.activeEvmWallet = wallet
    } else if (wallet?.chain === 'bitcoin') {
      state.activeBitcoinWallet = wallet
    }
  },
  addBitcoinWallet: (state, wallet?: ConnectedWallet) => {
    if (wallet) {
      state.bitcoinWallets.push(wallet)
      state.activeBitcoinWallet = wallet
    }
  },
  setActiveBitcoinWallet: (state, wallet?: ConnectedWallet) => {
    state.activeBitcoinWallet = wallet
  },
  setOnboardStatus: (state, status: OnboardStatus) =>
    (state.onboardStatus = status),
  clear: (state) => {
    state.evmWallets = []
    state.bitcoinWallets = []
    state.activeEvmWallet = undefined
    state.activeBitcoinWallet = undefined
    state.onboardStatus = 'initial'
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    initOnboard({ state, commit, dispatch, getters }): void {
      const walletsSub = this.app.$onboard.state.select('wallets')
      walletsSub.subscribe((wallets) => {
        if (wallets.length === 0 && state.onboardStatus === 'authorized') {
          dispatch('disconnect')
          return
        }
        if (wallets.length > 0) {
          const selectedWallet = {
            label: wallets[0].label,
            chain: 'evm',
            icon: wallets[0].icon,
            accounts: wallets[0].accounts,
            provider: wallets[0].provider,
            chainId: wallets[0].chains[0].id,
          }
          commit('addEvmWallet', Object.freeze(selectedWallet))
          commit('setOnboardStatus', 'authorized')
        }
        const connectedWallets = wallets.map(({ label }) => label)
        if (process.client)
          localStorage.setItem(
            CONNECETED_WALLETS_KEY,
            JSON.stringify(connectedWallets)
          )
        localStorage.setItem(
          CONNECETED_ADDRESS_KEY,
          getters.activeEvmWallet?.accounts[0].address ?? ''
        )
      })
    },

    /// Connect to evm wallet with onboard
    async connectWallet({ dispatch, commit }, wallet: WalletModule) {
      const selectedWallet = await dispatch('selectWallet', wallet)
      const { provider } = selectedWallet
      try {
        const [address] = await requestAccounts(provider)
        if (!address) {
          return
        }
        const chain = await getChainId(provider)

        const update: Pick<WalletState, 'accounts' | 'chains'> = {
          accounts: [{ address, ens: null, balance: null }],
          chains: [{ namespace: 'evm', id: chain }],
        }
        addWallet({ ...selectedWallet, ...update })
        trackWallet(provider, selectedWallet.label)
      } catch (error) {
        const { code } = error as { code: number; message: string }
        // user rejected account access
        if (code === ProviderRpcErrorCode.ACCOUNT_ACCESS_REJECTED) {
          console.log('User rejected')
        }
        await dispatch('disconnect')
        commit('clear')
      }
    },

    async selectWallet(_, wallet: WalletModule) {
      const existingWallet = this.app.$onboard.state
        .get()
        .wallets.find(
          (w) => w.label.toLowerCase() === wallet.label.toLowerCase()
        )
      if (existingWallet) {
        return existingWallet
      }

      const { chains } = this.app.$onboard.state.get()

      const { provider, instance } = await wallet.getInterface({
        chains,
        BigNumber,
        EventEmitter,
        appMetadata: null,
      })

      const loadedIcon = await wallet.getIcon()
      const selectedWallet = {
        label: wallet.label,
        icon: loadedIcon,
        provider,
        instance,
        accounts: [],
        chains: [{ namespace: 'evm', id: '0x1' }],
      } as WalletState
      return selectedWallet
    },

    /// Disconnect evm wallet with onboard
    async disconnect({ getters, commit }) {
      const label = getters.activeEvmWallet?.label
      commit('clear')
      if (label) {
        // removeWallet(label)
        await this.app.$onboard.disconnectWallet({ label })
        // disconnectWallet$.next(label)
      }
      if (process.client) localStorage.removeItem('connectedWallets')
    },

    async changeNetwork(
      { state },
      chainId: string
    ): Promise<boolean | undefined> {
      if (document.hidden) {
        return true
      }
      if (chainId === state.activeEvmWallet?.chainId) {
        return true
      }
      const res = await this.app.$onboard.setChain({ chainId })
      if (!res) {
        throw new Error(this.$i18n.t('changeNetworkErr').toString())
      }
      return res
    },

    async getNetwork() {
      const provider = new ethers.providers.Web3Provider(
        this.app.$onboard.state.get().wallets[0].provider
      )
      const id = (await provider.getNetwork()).chainId
      return id.toString()
    },

    async checkToken(
      { getters },
      {
        address,
        contractAddress,
      }: { address: string; balance?: string; contractAddress: string }
    ) {
      const provider = new ethers.providers.Web3Provider(
        getters.activeEvmWallet?.provider
      )
      const userAddress = getters.activeEvmWallet?.accounts[0].address
      if (!userAddress) return null
      const erc20Contract = new ethers.Contract(
        address,
        erc20ABI,
        provider.getSigner()
      )
      const approved = await erc20Contract.allowance(
        userAddress,
        contractAddress
      )

      return approved.toString()
      // if (BigNumber.from(approved).gte(BigNumber.from(balance))) return true
      // return false
    },

    async approveToken(
      { getters },
      {
        address,
        contractAddress,
        value,
      }: { address: string; contractAddress: string; value: string }
    ) {
      const provider = new ethers.providers.Web3Provider(
        getters.activeEvmWallet?.provider
      )
      const userAddress = getters.activeEvmWallet?.accounts[0]
      if (!userAddress) return null
      const erc20Contract = new ethers.Contract(
        address,
        erc20ABI,
        provider.getSigner()
      )
      const hash = await erc20Contract.approve(contractAddress, value)
      // return hash.wait()
      return hash
    },
    async registerReferral(
      { getters },
      info: { id: string; extend?: string; referralCode?: string }
    ) {
      const provider = new ethers.providers.Web3Provider(
        getters.activeEvmWallet?.provider
      )
      const userAddress = getters.activeEvmWallet?.accounts[0]
      if (!userAddress) return null
      const contractAddress = this.app.$config.isProduction
        ? REFERRER_CONTRACT
        : REFERRER_CONTRACT_TEST
      const contract = new ethers.Contract(
        contractAddress,
        referrerCoreABI,
        provider.getSigner()
      )
      const list = [info.id, info.extend].filter((s) => !!s)
      const code = info.referralCode ? Number('0x' + info.referralCode) : 2

      const txStr = ethers.utils.defaultAbiCoder.encode(
        ['uint8', 'uint32', ...list.map(() => 'string')],
        [2, code, ...list]
      )
      return await contract.register(txStr)
    },
    async getReferralInfo({ getters }): Promise<string[] | null> {
      const provider = new ethers.providers.JsonRpcProvider(
        'https://rpc.ankr.com/polygon'
      )
      const userAddress = getters.activeEvmWallet?.accounts[0].address
      if (!userAddress) return null
      const contractAddress = this.app.$config.isProduction
        ? REFERRER_CONTRACT
        : REFERRER_CONTRACT_TEST

      const contract = new ethers.Contract(
        contractAddress,
        referrerCoreABI,
        provider
      )

      const code = await contract.referrerAddressToId(userAddress)
      const info = (await contract.referrerIdToInfo(code)).extraInfo as string

      if (info.substring(65, 66) !== '0') {
        if (info.substring(192, 194) === '60') {
          const list = ethers.utils.defaultAbiCoder.decode(
            ['uint8', 'uint32', 'string'],
            info
          )

          return [list[2]]
        } else if (info.substring(192, 194) === '80') {
          const list = ethers.utils.defaultAbiCoder.decode(
            ['uint8', 'uint32', 'string', 'string'],
            info
          )
          return [list[2], list[3]]
        } else {
          return []
        }
      } else if (info.substring(64, 66) === '20') {
        return ethers.utils.defaultAbiCoder.decode(['string'], info) as string[]
      } else {
        return ethers.utils.defaultAbiCoder.decode(
          ['string', 'string'],
          info
        ) as string[]
      }
    },
    sendTransaction({ getters }, transaction: TransactionRequest) {
      const provider = new ethers.providers.Web3Provider(
        getters.activeEvmWallet?.provider
      )
      const signer = provider.getSigner()
      return signer.sendTransaction(transaction)
    },
    async getReferrerCode({ getters }) {
      const provider = new ethers.providers.Web3Provider(
        getters.activeEvmWallet?.provider
      )
      const userAddress = getters.activeEvmWallet?.accounts[0]
      if (!userAddress) return null
      const contractAddress = this.app.$config.isProduction
        ? REFERRER_CONTRACT
        : REFERRER_CONTRACT_TEST
      const contract = new ethers.Contract(
        contractAddress,
        referrerCoreABI,
        provider.getSigner()
      )
      const res = await contract.referrerIdToInfo(userAddress)
      console.log(res)

      return res
    },
    async crossBtc(
      { getters },
      {
        contractAddress,
        from,
        dstChainId,
        amount,
        toBtc,
        dstAddress,
      }: {
        contractAddress: string
        from: string
        dstChainId: string
        amount: string
        toBtc: boolean
        dstAddress: string
      }
    ) {
      const provider = new ethers.providers.Web3Provider(
        getters.activeEvmWallet?.provider
      )
      const userAddress = getters.activeEvmWallet?.accounts[0]
      if (!userAddress) return null
      const crossBtcContract = new ethers.Contract(
        contractAddress,
        crossBtcABI,
        provider.getSigner()
      )
      let payload: string
      if (toBtc) {
        payload = ethers.utils.defaultAbiCoder.encode(
          ['uint256', 'string', 'bytes'],
          [amount, dstAddress, '0x']
        )
      } else {
        payload = ethers.utils.defaultAbiCoder.encode(
          ['uint256', 'address', 'bytes'],
          [amount, dstAddress, '0x']
        )
      }
      const hash = await crossBtcContract.crossBTC(
        from,
        dstChainId,
        amount,
        payload
      )
      return hash
    },

    async estimateGas({ getters }, transaction: TransactionRequest) {
      const provider = new ethers.providers.Web3Provider(
        getters.activeEvmWallet?.provider
      )
      const res = await provider.estimateGas(transaction)
      return res
    },
  }
)
