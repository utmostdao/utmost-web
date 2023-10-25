<template>
  <div class="swap-page">
    <div class="content">
      <SwapTopBar />

      <div class="content-top">
        <div
          v-if="userAddress && fromToken"
          class="balance"
          :class="{ error: !isEnoughBalance }"
        >
          <span>{{ $t('homeInfo.balance') }}:</span>
          <span>{{ balance }}</span>

          <div v-if="loadingMap.balance" style="margin-left: 2px">
            <SpinnerLoader :size="14" />
          </div>
          <a v-else-if="!isOriginToken" class="balance-max" @click="onMax"
            >MAX</a
          >
        </div>
      </div>

      <div class="network-select">
        <div class="network-item">
          <SwapNetwork type="from" />
        </div>
        <div class="network-item">
          <SwapNetwork type="to" />
        </div>

        <div class="network-switch" @click.stop="onSwitch">
          <ArrowLeftRightIcon :size="20" />
        </div>
      </div>

      <SwapRecipientAddress />
      <SwapPreview v-if="swapPreviewInfos" />

      <div v-if="errStr" class="error-tip">
        {{ errStr }}
      </div>
    </div>

    <SwapConfirm />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'SwapPage',
  data() {
    return {}
  },
  computed: {
    balance() {
      return this.$helpers.shortFloatNum(
        this.$accessor.swap.balance ?? '0.0',
        6
      )
    },
    swapPreviewInfos() {
      return this.$accessor.swap.swapPreviewInfos
    },
    isOriginToken() {
      return this.$accessor.swap.isOriginToken
    },
    userAddress(): string | undefined {
      return this.$accessor.wallet.activeEvmWallet?.accounts?.[0]?.address
    },
    errStr(): undefined | string {
      return this.$accessor.swap.errStr
    },
    loadingMap() {
      return this.$accessor.swap.loadingMap
    },
    fromToken() {
      return this.$accessor.swap.fromToken
    },
    isEnoughBalance() {
      return this.$accessor.swap.isEnoughBalance
    },
  },
  methods: {
    onSwitch() {
      this.$accessor.swap.switchChainAndToken()
    },
    onMax() {
      const { balance } = this.$accessor.swap

      this.$accessor.swap.setAmount(balance || undefined)

      this.$accessor.swap.refreshData()
    },
  },
})
</script>

<style scoped lang="scss">
.swap-page {
  width: 100%;
  height: 100%;
  min-height: 500px;
  @include flexCsb;

  .connect-button {
    width: 120px;
    height: 40px;
    font-weight: bold;
    // padding: 5px 20px;
    background: $primary;
    color: white;
    border-radius: $radius;
  }

  .content {
    width: 100%;

    .error-tip {
      font-size: 14px;
      font-weight: 500;
      color: $error;
      margin-top: 40px;
      width: 100%;
      text-align: center;
    }

    .content-top {
      width: 100%;
      @include flexCc;
      align-items: flex-end;
      margin: 20px 0 12px 0;

      .balance {
        font-size: 12px;
        color: $textColor;
        font-weight: 500;
        @include flexRc;

        &.error {
          color: $error;
        }
        .balance-max {
          cursor: pointer;
          margin-left: 4px;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    .network-select {
      width: 100%;
      position: relative;
      @include flexCc;
      user-select: none;

      .network-item {
        padding: 5px 0;
      }

      .network-switch {
        position: absolute;
        width: 30px;
        height: 30px;
        flex-shrink: 0;
        background-color: $secondary;
        border-radius: 50%;
        @include flexCc;
        cursor: pointer;
        transition: 0.4s;

        ::v-deep svg {
          stroke: $primary;
          transition: 0.4s;
        }

        &:hover {
          transform: scale(1.1);
          transition: 0.4s;

          ::v-deep svg {
            transform: scale(1.2);
            transition: 0.4s;
          }
        }
      }
    }
  }
}
</style>
