import { generateBitcoinData } from './../utils/helpers'
import { Network } from '~/plugins/helpers'
describe('utils test', () => {
  test('generate bitcoin data', () => {
    const network: Network = {
      name: 'Optimism',
      network: 'OPTIMISM',
      value: 'optimism',
      chainId: 10,
      rpc: '',
      chainType: 'EVM',
      symbol: 'ETH',
    }
    const result = generateBitcoinData(
      network,
      '0x22b86fbcb02cf415845d1795a71e88d260eb6e11'
    )
    expect(result).toBe(
      '0000000a00000000000000000000000022b86fbcb02cf415845d1795a71e88d260eb6e11'
    )
  })
})
