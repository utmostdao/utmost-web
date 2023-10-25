import { Plugin } from '@nuxt/types'
import { SbtAuthWallet } from '@sbtauth/sbtauth-wallet'
import { ConnectedWallet } from './../store/wallet'

const sbtauthPlugin: Plugin = ({ $accessor }, inject) => {
  const sbtauth = new SbtAuthWallet({
    developMode: true,
    defaultChainId: '0x5',
    targetUrl: 'https://connect.safematrix.io',
    uiConfig: {
      theme: 'light',
      locale: 'en-US',
    },
  })
  inject('sbtauth', sbtauth)

  sbtauth.provider.on('accountsChanged', (data: string[] | undefined) => {
    if (data && data.length > 0) {
      const address = data[0]
      const wallet: ConnectedWallet = {
        label: 'sbtauth',
        chain: 'evm',
        icon: SbtAuthWallet.icon,
        accounts: [{ address }],
        provider: sbtauth.provider,
      }
      $accessor.wallet.addEvmWallet(Object.freeze(wallet))
    }
  })
  sbtauth.provider.on('chainChanged', () => {
    const address = sbtauth.provider.accounts[0]
    if (!address) return
    const wallet: ConnectedWallet = {
      label: 'sbtauth',
      chain: 'evm',
      icon: SbtAuthWallet.icon,
      accounts: [{ address }],
      provider: sbtauth.provider,
    }
    $accessor.wallet.addEvmWallet(Object.freeze(wallet))
  })
  // const bitcoinProvider = sbtauth.provider.bitcoinProvider

  // if (bitcoinProvider) {
  //   bitcoinProvider.on('accountsChanged', (data: string[] | undefined) => {
  //     if (data && data.length > 0) {
  //       const address = data[0]
  //       const wallet: ConnectedWallet = {
  //         chain: 'bitcoin',
  //         label: 'sbtauth',
  //         icon: SbtAuthWallet.icon,
  //         accounts: [{ address }],
  //         provider: bitcoinProvider,
  //       }
  //       $accessor.wallet.addBitcoinWallet(Object.freeze(wallet))
  //     }
  //   })
  // }

  sbtauth.provider.on('disconnect', () => {
    $accessor.wallet.removeEvmWallet('sbtauth')
    $accessor.wallet.removeBitcoinWallet('sbtauth')
  })
}

export default sbtauthPlugin
