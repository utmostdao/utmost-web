// rpc 由以下循环赋值
const chainsObj = {
  eth: {
    name: 'Ethereum',
    network: 'ETH',
    rpc: 'https://mainnet.infura.io/v3/',
    value: 'eth',
    chainId: 1,
    chainType: 'EVM',
    symbol: 'ETH',
    supportContract: true,
    scanUrl: 'https://cn.etherscan.com/',
    bridgetime: 3,
  },
  polygon: {
    name: 'Polygon',
    network: 'POLYGON',
    value: 'polygon',
    rpc: 'https://polygon-rpc.com/',
    chainId: 137,
    chainType: 'EVM',
    symbol: 'MATIC',
    supportContract: true,
    scanUrl: 'https://polygonscan.com/',
    bridgetime: 20,
  },
  bsc: {
    name: 'BSC',
    network: 'BSC',
    value: 'bsc',
    rpc: 'https://bsc-dataseed1.binance.org/',
    chainId: 56,
    chainType: 'EVM',
    symbol: 'BNB',
    supportContract: true,
    scanUrl: 'https://bscscan.com/',
    bridgetime: 2,
  },
  optimism: {
    name: 'Optimism',
    network: 'OPTIMISM',
    value: 'optimism',
    rpc: 'https://optimism-mainnet.infura.io',
    chainId: 10,
    chainType: 'EVM',
    symbol: 'ETH',
    supportContract: true,
    scanUrl: 'https://optimistic.etherscan.io/',
    bridgetime: 1,
  },
  arbitrum: {
    name: 'Arbitrum',
    network: 'ARBITRUM',
    value: 'arbitrum',
    rpc: 'https://arb1.arbitrum.io/rpc',
    chainId: 42161,
    chainType: 'EVM',
    symbol: 'ETH',
    supportContract: true,
    scanUrl: 'https://arbiscan.io/',
    bridgetime: 1,
  },
  avalanche: {
    name: 'Avalanche',
    network: 'AVALANCHE',
    value: 'avalanche',
    rpc: 'https://rpc.ankr.com/avalanche',
    chainId: 43114,
    chainType: 'EVM',
    symbol: 'AVAX',
    supportContract: true,
    scanUrl: 'https://snowtrace.io/',
    bridgetime: 2,
  },
  zksync: {
    name: 'zkSync',
    network: 'ZKSYNC',
    value: 'zksync',
    rpc: 'https://mainnet.era.zksync.io',
    chainId: 324,
    chainType: 'EVM',
    symbol: 'ETH',
    supportContract: true,
    scanUrl: 'https://explorer.zksync.io/',
    bridgetime: 1.5,
  },
  linea: {
    name: 'Linea',
    network: 'LINEA',
    value: 'linea',
    rpc: 'https://rpc.linea.build',
    chainId: 59144,
    chainType: 'EVM',
    symbol: 'ETH',
    supportContract: true,
    scanUrl: 'https://lineascan.build/',
    decimals: 18,
    bridgetime: 3,
  },
  base: {
    name: 'Base',
    network: 'BASE',
    value: 'base',
    rpc: 'https://mainnet.base.org/',
    chainId: 8453,
    chainType: 'EVM',
    symbol: 'ETH',
    supportContract: true,
    scanUrl: 'https://basescan.org/',
    decimals: 18,
    bridgetime: 1,
  },
}

export type Chain = {
  name: string
  network: string
  value: string
  rpc: string
  chainId: number
  chainType: string
  symbol: string
  supportContract: boolean
  scanUrl: string
  decimals?: number
  bridgetime?: number
}

// const rpcApi = "https://rpc.abmatrix.cn/json-rpc/http"

const chains: { [key: string]: Chain } = chainsObj
// const chainKeys = Object.keys(chains)

// 重新赋值rpc url
// chainKeys.forEach((k) => {
//   chains[k].rpc = `${rpcApi}/${k}`
// })

const _chains = chains as typeof chainsObj
export default _chains
