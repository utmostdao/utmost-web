import { Plugin } from '@nuxt/types'
import type { WalletInit } from '@web3-onboard/common'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'
import { BigNumber, ethers } from 'ethers'
import init, { OnboardAPI } from 'web3-onboard-core'
import { Chain } from '~/types/api'
import { SwapContractDetails } from '~/types/crossSwagger'
import chains, { Chain as ChainConfig } from '~/utils/chains'
import { ORIGIN_TOKEN } from '~/utils/constants'
import { erc20ABI } from '~/utils/abi'

export type Transaction = {
  to?: string
  from?: string
  nonce?: string
  data?: string
  value?: string
  gasLimit?: string
  gasPrice?: string
  maxPriorityFeePerGas?: string
  maxFeePerGas?: string
}

export type Onboard = OnboardAPI & {
  onboard: OnboardAPI
  signTransaction(
    transaciton: Transaction
  ): Promise<ethers.providers.TransactionResponse>
  getEstimateGas(transaciton: Transaction): Promise<BigNumber>
  supportedChains: Chain[]
  supportedNetworks: ChainConfig[]
  crossSwap: (
    initialDeployer: string, //
    srcToken: string,
    srcChainId: string,
    dstChainId: string,
    dstAddress: string,
    amount: string,
    dstFeeAmount: string,
    recipient: string, //
    refundAddress: string, //
    partialFill: boolean, //
    isNative: boolean,
    routerList: SwapContractDetails
  ) => Promise<any>
  waitForTransaction(hash: string): Promise<ethers.providers.TransactionReceipt>
  increaseLiquidity: (
    poolID: string,
    amount: string,
    srcChainId: string,
    routerList: SwapContractDetails,
    isNative: boolean
  ) => Promise<any>
  decreaseLiquidity: (
    poolID: string,
    amount: string,
    srcChainId: string,
    routerList: SwapContractDetails
  ) => Promise<any>
  getBalance: (info: {
    chainId: number
    contractAddress: string
    userAddress: string
    decimals: number
  }) => Promise<string>

  getTokenSymbol: (info: {
    chainId: number
    contractAddress: string
  }) => Promise<string>
  getTokenName: (info: {
    chainId: number
    contractAddress: string
  }) => Promise<string>
  getTokenDecimals: (info: {
    chainId: number
    contractAddress: string
  }) => Promise<string>
}

// const safematrix = {
//   label: 'Safematrix',
//   injectedNamespace: 'ethereum',
//   checkProviderIdentity: ({ provider }: any) =>
//     !!provider && !!provider.isSafematrix,
//   getIcon: async () => (await import('./icon')).default,
//   getInterface: () => ({
//     provider: (window as any).ethereum,
//   }),
//   platforms: ['mobile'],
// }

const wallet: Plugin = ({ $accessor }, inject) => {
  const chainObjValues = Object.values(chains)
  const supportedNetworks = chainObjValues.filter(
    (item) => item.chainType === 'EVM'
  )

  const supportedChains: Chain[] = supportedNetworks.map((chain: any) => ({
    id: '0x' + chain.chainId.toString(16),
    token: chain.symbol,
    label: chain.name,
    rpcUrl: chain.rpc,
  }))

  const injected = injectedModule()

  const walletConnect = walletConnectModule({
    projectId: 'd0bb3227bd5328612e21df911565385d',
    requiredChains: supportedChains.map((chain) => Number(chain.id)),
  })

  const wallets = [injected, walletConnect] as WalletInit[]

  async function getEstimateGas(transaction: Transaction): Promise<BigNumber> {
    const provider = new ethers.providers.Web3Provider(
      onboard.state.get().wallets[0].provider
    )
    const res = await provider.estimateGas(transaction)
    return res
  }

  async function signTransaction(
    transaction: Transaction
  ): Promise<ethers.providers.TransactionResponse> {
    const provider = new ethers.providers.Web3Provider(
      onboard.state.get().wallets[0].provider
    )
    const signer = provider.getSigner()
    const nonce = await signer.getTransactionCount()
    return signer.sendTransaction({
      ...transaction,
      nonce,
      type: transaction.gasPrice ? 0 : 2,
    })
  }

  async function waitForTransaction(
    hash: string
  ): Promise<ethers.providers.TransactionReceipt> {
    const provider = new ethers.providers.Web3Provider(
      onboard.state.get().wallets[0].provider
    )
    return await provider.waitForTransaction(hash)
  }

  async function getBalance({
    chainId,
    contractAddress,
    userAddress,
    decimals,
  }: {
    chainId: number
    contractAddress: string
    userAddress: string
    decimals: number
  }) {
    const connectedChianId = Number(
      $accessor.wallet.activeEvmWallet?.chainId ?? '-1'
    )
    // if (chainId !== connectedChianId) {
    //   await $accessor.wallet.changeNetwork(chainId16)
    // }

    let provider
    const chainInfo = supportedChains.find(
      (item) => Number(item.id) === chainId
    )
    if (connectedChianId !== chainId && chainInfo) {
      provider = new ethers.providers.JsonRpcProvider(chainInfo.rpcUrl)
    } else {
      if (chainId !== connectedChianId) {
        await $accessor.wallet.changeNetwork('0x' + chainId.toString(16))
      }
      const walletProvider = $accessor.wallet.activeEvmWallet?.provider
      provider = new ethers.providers.Web3Provider(walletProvider)
    }

    // 原生币
    if (contractAddress.toLowerCase() === ORIGIN_TOKEN) {
      const res = await provider.getBalance(userAddress)
      return ethers.utils.formatUnits(res.toString(), decimals.toString())
    }

    const contract = new ethers.Contract(contractAddress, erc20ABI, provider)
    const res = await contract.balanceOf(userAddress)
    return ethers.utils.formatUnits(res.toString(), decimals.toString())
  }

  async function getTokenSymbol({
    chainId,
    contractAddress,
  }: {
    chainId: number
    contractAddress: string
  }) {
    const chainInfo = supportedChains.find(
      (item) => Number(item.id) === chainId
    )
    if (!chainInfo) return
    const provider = new ethers.providers.JsonRpcProvider(chainInfo.rpcUrl)
    const contract = new ethers.Contract(contractAddress, erc20ABI, provider)
    const res = await contract.symbol()

    return res.toString()
  }

  async function getTokenName({
    chainId,
    contractAddress,
  }: {
    chainId: number
    contractAddress: string
  }) {
    const chainInfo = supportedChains.find(
      (item) => Number(item.id) === chainId
    )
    if (!chainInfo) return
    const provider = new ethers.providers.JsonRpcProvider(chainInfo.rpcUrl)
    const contract = new ethers.Contract(contractAddress, erc20ABI, provider)
    const res = await contract.name()

    return res.toString()
  }

  async function getTokenDecimals({
    chainId,
    contractAddress,
  }: {
    chainId: number
    contractAddress: string
  }) {
    const chainInfo = supportedChains.find(
      (item) => Number(item.id) === chainId
    )
    if (!chainInfo) return
    const provider = new ethers.providers.JsonRpcProvider(chainInfo.rpcUrl)
    const contract = new ethers.Contract(contractAddress, erc20ABI, provider)
    const res = await contract.decimals()

    return res.toString()
  }

  const onboard = init({
    wallets,
    chains: supportedChains,
    appMetadata: {
      name: 'Utmost Swap',
      icon: 'https://docs.walletconnect.com/img/walletconnect-logo.svg',
      description: 'Utmost swap using Onboard',
      recommendedInjectedWallets: [
        { name: 'MetaMask', url: 'https://metamask.io' },
      ],
    },
  })

  inject('onboard', {
    ...onboard,
    signTransaction,
    getEstimateGas,
    supportedChains,
    supportedNetworks,
    waitForTransaction,
    getBalance,
    getTokenSymbol,
    getTokenName,
    getTokenDecimals,
  })
}

export default wallet
