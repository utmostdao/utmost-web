import { Plugin } from '@nuxt/types'
import { CONNECETED_WALLETS_KEY } from '~/utils'

const initPlugin: Plugin = async ({ $accessor, $onboard }) => {
  const previouslyConnectedWallets = JSON.parse(
    process.client ? localStorage.getItem(CONNECETED_WALLETS_KEY) ?? '[]' : '[]'
  )
  $accessor.wallet.initOnboard()
  if (previouslyConnectedWallets.length > 0) {
    const label = previouslyConnectedWallets[0]
    const wallet = $onboard.state
      .get()
      .walletModules.find((w) => w.label.toLowerCase() === label.toLowerCase())
    await $accessor.wallet.connectWallet(wallet!)
  }
}

export default initPlugin
