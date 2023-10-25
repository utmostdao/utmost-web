<template>
  <div class="change-network">
    <select-button class="button">
      <div class="network-info">
        <el-image
          v-if="currentNetwork.imgLink !== ''"
          :src="$helpers.chainLogo(currentNetwork.id)"
          class="icon"
        ></el-image>
        <div v-if="!$breakpoints.sSm" class="address">
          {{
            currentNetwork.label === 'ETH' ? 'Ethereum' : currentNetwork.label
          }}
        </div>
      </div>
    </select-button>
    <div class="menu">
      <network-card
        v-for="(network, index) of networks"
        :key="index"
        class="item"
        :network="network"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Chain } from '~/types/api'
export default Vue.extend({
  name: 'ChangeNetwork',
  computed: {
    chainId() {
      return this.$accessor.wallet.activeEvmWallet?.chainId
    },
    currentNetwork(): Chain {
      let net: Chain = {
        label: 'No Network',
        id: '0',
        // imgLink: '',
        token: '',
        rpcUrl: '',
      }
      this.networks.forEach((network) => {
        if (network.id === this.chainId) {
          net = {
            ...network,
          }
        }
      })
      return net
    },
    networks() {
      if (this.$route.path === this.localePath('/')) {
        return this.$onboard.supportedChains
      } else {
        return this.$onboard.supportedNetworks
      }
    },
  },
})
</script>

<style scoped lang="scss">
.change-network {
  margin-right: 10px;
  .button {
    span .network-info {
      width: 100%;
      @include flexRsa;
      .icon {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 2px;
      }
      .address {
        width: calc(100% - 30px);
        height: 17px;
        text-align: left;
        font-size: 12px;
        color: $textColor;
        white-space: nowrap;
        font-weight: 400;
        line-height: 17px;
        @include phone() {
          width: 0;
        }
      }
    }
  }
  .menu {
    padding-top: 10px;
    position: absolute;
    min-width: 100px;
    height: 0;
    font-size: 0;
    .item {
      height: 0;
    }
  }
}
.change-network:hover {
  .menu {
    font-size: 12px;
    font-weight: 400;
    line-height: 24px;
    margin-top: 5px;
    text-align: left;
    border-radius: 10px;
    background: $secondary;
    display: flex;
    @include flexCsb;
    height: fit-content;
    z-index: 1000;
    .item {
      margin: 10px 0px;
      padding-inline: 10px;
      color: $textColorOp8;
      height: 24px;
      font-size: 12px;
      line-height: 20px;
      cursor: pointer;
    }
  }
}
</style>
