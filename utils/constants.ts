export const CONNECETED_WALLETS_KEY = 'connected_wallets'
export const CONNECETED_ADDRESS_KEY = 'connected_address'
export const ORIGIN_TOKEN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
export const regETH = /^0x[0-9a-fA-F]{40}$/
export const INFINITY_BALANCE =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

export const TX_HISTORY = 'TXS'
export const CHAIN_TOKENS = 'CHAIN_TOKENS'

export const REG_ETH = /^0x[0-9a-fA-F]{40}$/
export const REG_SOL = /^[0-9a-zA-Z]{44}$/
export const REG_BTC = /^(bc1|[13]|tb1|[mn])[a-zA-HJ-NP-Z0-9]{25,59}$/

export const NETWORK_REGEX = {
  BITCOIN: REG_BTC,
  SOLANA: REG_SOL,
  EVM: REG_ETH,
}

export const NUM_REG = /^[0-9]+\.?([0-9]+)?$/i // 验证数字： 0.0

export const REFERRER_CONTRACT_TEST =
  '0xcFc2a621a207563C96D4413377Eb558E9C54C8a3'
export const REFERRER_CONTRACT = '0x1add183f42382cc70b005af15608efcc1342e6e3'

export const CUSTOM_TOKENS = 'CUSTOM_TOKENS'
