<template>
  <div class="wallet-card">
    <div class="status" :class="{ active: active }"></div>
    <template v-if="wallet.icon">
      <img v-if="wallet.label === 'sbtauth'" class="icon" :src="iconUrl" />
      <div v-else class="icon" v-html="wallet.icon"></div>
    </template>
    <div class="info">
      <div class="name">{{ wallet.label }}</div>
      <div
        class="address"
        @click.stop="$helpers.copyText(wallet.accounts[0].address)"
      >
        {{ $helpers.shortAddress(wallet.accounts[0].address) }}
        <copy-icon :size="14"></copy-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { ConnectedWallet } from '~/store/wallet'

export default Vue.extend({
  name: 'WalletCard',
  props: {
    connectWallet: {
      type: Object,
      required: true,
    } as PropOptions<ConnectedWallet>,
  },
  computed: {
    wallet(): ConnectedWallet {
      return this.connectWallet
    },
    activeEvmWallet(): ConnectedWallet | undefined {
      return this.$accessor.wallet.activeEvmWallet
    },
    activeBitcoinWallet(): ConnectedWallet | undefined {
      return this.$accessor.wallet.activeBitcoinWallet
    },
    iconUrl(): any {
      if (this.wallet.chain === 'evm') {
        const chainId = this.connectWallet.provider.chainId
        return this.$helpers.getNetworkLogo(chainId)
      }
      return this.$helpers.getNetworkLogo(this.wallet.chain)
    },
    active(): boolean {
      if (this.wallet.chain === 'evm') {
        return this.wallet.label === this.activeEvmWallet?.label
      } else {
        return this.wallet.label === this.activeBitcoinWallet?.label
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.wallet-card {
  height: 60px;
  width: 100%;
  margin-bottom: 15px;
  border-radius: 4px;
  padding: 0 14px;
  background-color: $background;
  cursor: pointer;
  @include flexR;
  align-items: center;
  .status {
    height: 10px;
    width: 10px;
    border-radius: 5px;
    background: $secondary;
    margin-right: 10px;
    &.active {
      background: green;
    }
  }
  .icon {
    width: 30px;
    height: 30px;
    border-radius: 4px;
    margin-right: 6px;
  }
  .info {
    @include flexC;
    align-items: flex-start;
    margin-left: 10px;
    color: $textColorOp8;
    .address {
      margin-top: 4px;
      font-size: 12px;
      @include flexRc;
      svg {
        margin: 0px 0 0 4px;
      }
    }
  }
}
</style>
