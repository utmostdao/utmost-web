<template>
  <div class="home-top-bar">
    <div class="left-panel">
      <UtmostLogo class="logo" />
      <UtmostFont class="logo-font" :size="isMobile ? 16 : 20" />
    </div>
    <div class="right-panel">
      <!-- <theme-switch class="item"></theme-switch> -->
      <!-- <language-setting class="item" /> -->
      <div class="connect-wallet" @click="$vfm.show('wallet-panel-dialog')">
        <div v-if="address">
          <select-button class="button connected-button">
            <div class="address-info">
              <LayoutSwitchNetwork />
              <div class="account-infos">
                <div class="address">
                  {{ $helpers.shortAddress(address) }}
                </div>
                <div v-if="swapSummary" class="earnings-info">
                  <span> UTS: </span>
                  <span class="amount">&nbsp; {{ swapSummary.allScore }}</span>
                </div>
              </div>
            </div>
          </select-button>
        </div>
        <select-button
          v-else
          class="button connect-button"
          @click="$vfm.show('wallet-panel-dialog')"
        >
          {{ $t('connectWallet') }}
        </select-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SwapSummary } from '~/types/swagger'

export default Vue.extend({
  name: 'HomeTopBar',
  data() {
    return {
      size: 28,
    }
  },
  fetch() {
    this.$accessor.swap.getSwapSummary()
  },
  computed: {
    swapSummary(): SwapSummary {
      return this.$accessor.swap.swapSummary
    },
    address() {
      return this.$accessor.wallet.activeEvmWallet?.accounts[0].address
    },
    chainId(): string | undefined {
      return this.$accessor.wallet.activeEvmWallet?.chainId
    },
    chainIcon(): string {
      const chains = this.$accessor.swap.chainList
      return (
        chains.find(
          (item) => Number(item.chainID) === Number(this.chainId ?? '')
        )?.chainIcon ?? ''
      )
    },
    isMobile() {
      return this.$breakpoints.sMd
    },
    // isInRecordPage() {
    //   return this.getRouteBaseName() === 'record'
    // },
  },
  watch: {
    address: {
      deep: true,
      handler() {
        this.$accessor.swap.getSwapSummary()
      },
    },
  },
})
</script>

<style scoped lang="scss">
.plain-button {
  font-size: 14px;
  font-weight: bold;
}
.home-top-bar {
  height: 100%;
  width: 100%;
  @include flexRsb;
  position: relative;
  padding: 0 20px;

  @include phone {
    padding: 0 10px;
  }
  .left-panel {
    // position: absolute;
    // left: 50px;
    @include flexRc;
    @include phone() {
      // left: 10px;
    }
    .title {
      font-size: 24px;
      color: $textColor;
    }
    .logo {
      height: 30px;

      @include phone {
        height: 30px;
      }
    }

    .logo-font {
      // height: 20px;
      margin-left: 10px;
      margin-top: 2px;

      :deep() svg {
        fill: $textColor;
      }
    }
    .language-setting {
      margin-left: 20px;
    }
  }
  .right-panel {
    // position: absolute;
    // right: 20px;
    @include flexR;
    @include phone() {
      // right: 10px;
    }

    .item {
      margin-right: 24px;
    }
    .connect-button {
      width: 120px;
      height: 40px;
      font-weight: bold;
      // padding: 5px 20px;
      background: $primary;
      color: white;
      border-radius: $radius;
    }

    .connected-button {
      min-width: 120px;
      height: 40px;
      padding: 0 12px 0 4px;
      position: relative;
      border-radius: 20px;
      border: 2px solid $primary;
      transition: 0.3s;

      &.swap-summary {
        height: 48px;
        border-radius: 12px;
        transition: 0.3s;
      }
    }
  }
  .router-switcher {
    margin-inline: auto;
  }
}
.address-info {
  @include flexRc;

  .account-infos {
    width: 100%;
    @include flexCc;

    .address {
      height: 17px;
      font-size: 14px;
      color: $textColor;
      font-weight: 400;
      line-height: 17px;
      @include phone() {
        // width: 0px;
      }
    }

    .earnings-info {
      color: $textColorOp5;
      font-size: 12px;
      font-weight: 400;
      @include flexR;
      width: 100%;

      .amount {
        color: $warning;
      }
    }
  }
  .icon {
    height: 30px;
    width: 30px;
    margin-right: 6px;
    border-radius: 15px;
  }
}

.network {
  width: 40px;
  margin-right: 10px;
  .icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }
}
</style>
