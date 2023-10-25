/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */
import { CrossApi } from './crossApi'

export class CrossYapi extends CrossApi {
  get browserDetailExtrinsicEventRecords() {
    return this.ft
      .path('/browser/detail/extrinsicEventRecords')
      .method('get')
      .create()!
  }

  get browserDetailExtrinsicBaseInfos() {
    return this.ft
      .path('/browser/detail/extrinsicBaseInfos')
      .method('get')
      .create()!
  }

  get browserNodeNextUps() {
    return this.ft.path('/browser/node/nextUps').method('get').create()!
  }

  get browserVerifiedNodes() {
    return this.ft.path('/browser/verified/nodes').method('get').create()!
  }

  get browserTickRecords() {
    return this.ft.path('/browser/tickRecords').method('get').create()!
  }

  get browserDetailBlockEventRecords() {
    return this.ft
      .path('/browser/detail/blockEventRecords')
      .method('get')
      .create()!
  }

  get browserDetailBlockExtrinsicRecords() {
    return this.ft
      .path('/browser/detail/blockExtrinsicRecords')
      .method('get')
      .create()!
  }

  get browserDetailBlockBaseInfos() {
    return this.ft
      .path('/browser/detail/blockBaseInfos')
      .method('get')
      .create()!
  }

  get browserBlockChainEventRecords() {
    return this.ft
      .path('/browser/blockChain/eventRecords')
      .method('get')
      .create()!
  }

  get browserBlockChainExtrinsicRecords() {
    return this.ft
      .path('/browser/blockChain/extrinsicRecords')
      .method('get')
      .create()!
  }

  get browserBlockChainBlockInfos() {
    return this.ft
      .path('/browser/blockChain/blockInfos')
      .method('get')
      .create()!
  }

  get browserBlockChainAccountRecords() {
    return this.ft
      .path('/browser/blockChain/accountRecords')
      .method('get')
      .create()!
  }

  get browserSearch() {
    return this.ft.path('/browser/search').method('get').create()!
  }

  get browserTxHash() {
    return this.ft.path('/browser/txHash').method('get').create()!
  }

  get browserDetailValidatorBaseInfos() {
    return this.ft
      .path('/browser/detail/validatorBaseInfos')
      .method('get')
      .create()!
  }

  get browserDetailValidatorNominatorInfos() {
    return this.ft
      .path('/browser/detail/validatorNominatorInfos')
      .method('get')
      .create()!
  }

  get browserCustomerData() {
    return this.ft.path('/browser/customerData').method('get').create()!
  }

  get browserTimeSeries() {
    return this.ft.path('/browser/timeSeries').method('get').create()!
  }

  get browserDetailAccountBaseInfos() {
    return this.ft
      .path('/browser/detail/accountBaseInfos')
      .method('get')
      .create()!
  }

  get browserDetailAccountNominators() {
    return this.ft
      .path('/browser/detail/accountNominators')
      .method('get')
      .create()!
  }

  get browserDetailAccountExtrinsics() {
    return this.ft
      .path('/browser/detail/accountExtrinsics')
      .method('get')
      .create()!
  }

  get browserDetailAccountAssetInfos() {
    return this.ft
      .path('/browser/detail/accountAssetInfos')
      .method('get')
      .create()!
  }

  get browserDetailAccountEdgeAssetInfos() {
    return this.ft
      .path('/browser/detail/accountEdgeAssetInfos')
      .method('get')
      .create()!
  }

  get browserDetailAccountTransactions() {
    return this.ft
      .path('/browser/detail/accountTransactions')
      .method('get')
      .create()!
  }

  get browserHomeTransferPreview() {
    return this.ft.path('/browser/home/transferPreview').method('get').create()!
  }

  get browserHomeNetworkPreview() {
    return this.ft.path('/browser/home/networkPreview').method('get').create()!
  }

  get browserHomeBlocksPreview() {
    return this.ft.path('/browser/home/blocksPreview').method('get').create()!
  }

  get browserNodeValidators() {
    return this.ft.path('/browser/node/validators').method('get').create()!
  }

  get bridgeRemark() {
    return this.ft.path('/bridge/remark').method('get').create()!
  }

  get bridgeRemarkPut() {
    return this.ft.path('/bridge/remark').method('put').create()!
  }

  get bridgeRemarkPost() {
    return this.ft.path('/bridge/remark').method('post').create()!
  }

  get bridgeBridgeCache() {
    return this.ft.path('/bridge/bridge-cache').method('get').create()!
  }

  get bridgeBridgeCachePut() {
    return this.ft.path('/bridge/bridge-cache').method('put').create()!
  }

  get bridgeBridgeCachePost() {
    return this.ft.path('/bridge/bridge-cache').method('post').create()!
  }

  get bridgeBridgeCacheDelete() {
    return this.ft.path('/bridge/bridge-cache').method('delete').create()!
  }

  get bridgeCommittees() {
    return this.ft.path('/bridge/committees').method('get').create()!
  }

  get bridgeCrossBridges() {
    return this.ft.path('/bridge/cross-bridges').method('get').create()!
  }

  get bridgeCrossBridge() {
    return this.ft.path('/bridge/cross-bridge').method('get').create()!
  }

  get bridgeSupportChains() {
    return this.ft.path('/bridge/support-chains').method('get').create()!
  }

  get bridgeAnchorReadyCheck() {
    return this.ft.path('/bridge/anchor-ready:check').method('get').create()!
  }

  get bridgeBridgeBrowserTxs() {
    return this.ft.path('/bridge/bridge-browser-txs').method('get').create()!
  }

  get bridgeBridgeBrowserTxDetail() {
    return this.ft
      .path('/bridge/bridge-browser-tx:detail')
      .method('get')
      .create()!
  }

  get bridgeBridgeBrowserBridges() {
    return this.ft
      .path('/bridge/bridge-browser-bridges')
      .method('get')
      .create()!
  }

  get bridgeBridgeBrowserBridges2() {
    return this.ft
      .path('/bridge/bridge-browser-bridges2')
      .method('get')
      .create()!
  }

  get bridgeBridgeBrowserHome() {
    return this.ft.path('/bridge/bridge-browser-home').method('get').create()!
  }

  get swapPools() {
    return this.ft.path('/swap/pools').method('get').create()!
  }

  get swapJoinedPools() {
    return this.ft.path('/swap/joined-pools').method('get').create()!
  }

  get swapSwapRecords() {
    return this.ft.path('/swap/swap-records').method('get').create()!
  }

  get swapSwapRecord() {
    return this.ft.path('/swap/swap-record').method('get').create()!
  }

  get swapSwapRecordPost() {
    return this.ft.path('/swap/swap-record').method('post').create()!
  }

  get swapGas() {
    return this.ft.path('/swap:gas').method('get').create()!
  }

  get swapContractDetails() {
    return this.ft.path('/swap:contract-details').method('get').create()!
  }

  get swapChainDetails() {
    return this.ft.path('/swap:chain-details').method('get').create()!
  }

  get swapUserTokenBalance() {
    return this.ft.path('/swap:user-token-balance').method('get').create()!
  }

  get swapExchangeRate() {
    return this.ft.path('/swap:exchange-rate').method('get').create()!
  }

  get nodeValidators() {
    return this.ft.path('/node/validators').method('get').create()!
  }

  get nodeEpochInfo() {
    return this.ft.path('/node/epoch-info').method('get').create()!
  }

  get nodeEraInfo() {
    return this.ft.path('/node/era-info').method('get').create()!
  }

  get nodeCheckVirtualAccountCreation() {
    return this.ft
      .path('/node/check-virtual-account-creation')
      .method('get')
      .create()!
  }

  get blockchainProviderInfo() {
    return this.ft.path('/blockchain/provider:info').method('get').create()!
  }

  get blockchainProviders() {
    return this.ft.path('/blockchain/providers').method('get').create()!
  }

  get blockchainRewards() {
    return this.ft.path('/blockchain/rewards').method('get').create()!
  }

  get blockchainDevices() {
    return this.ft.path('/blockchain/devices').method('get').create()!
  }

  get blockchainDeviceInfo() {
    return this.ft.path('/blockchain/device:info').method('get').create()!
  }

  get blockchainClaims() {
    return this.ft.path('/blockchain/claims').method('get').create()!
  }

  get blockchainPunishs() {
    return this.ft.path('/blockchain/punishs').method('get').create()!
  }
}
