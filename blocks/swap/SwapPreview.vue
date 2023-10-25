<template>
  <div class="swap-preview">
    <div v-for="(item, index) in options" :key="index" class="item">
      <div class="label">{{ item.label }}</div>
      <div class="value">
        <span>{{ previewFetching ? '-' : item.value }}</span>

        <template
          v-if="!previewFetching && ['received', 'bridgeFee'].includes(item.id)"
        >
          <div class="switch-icon" @click="onSwitch(item.id)">
            <ArrowLeftRightIcon :size="14" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Decimal from 'decimal.js'
import Vue from 'vue'
export default Vue.extend({
  name: 'SwapPreview',
  data() {
    return {
      isUsd: {
        received: false,
        bridgeFee: false,
      },
    }
  },
  computed: {
    previewFetching() {
      return this.$accessor.swap.loadingMap.preview
    },
    bestQuote(): string {
      const fromToken = this.$accessor.swap.fromToken
      const toToken = this.$accessor.swap.toToken
      const swapPreview = this.$accessor.swap.swapPreviewInfos
      const amount = this.$accessor.swap.amount
      const srcRatio = new Decimal(1).div(new Decimal(amount ?? 0))
      const dstAmount = srcRatio
        .mul(new Decimal(swapPreview?.expectedReturnAmount ?? '0'))
        .toString()

      return `1 ${
        fromToken?.swapThirdPartySymbol
      } ≈ ${this.$helpers.shortFloatNum(dstAmount ?? '', 6)} ${
        toToken?.swapThirdPartySymbol
      } `
    },
    protocolFee(): string {
      return new Decimal(this.$accessor.swap.swapPreviewInfos?.utmostFee ?? '0')
        .toNumber()
        .toLocaleString('en-US', {
          maximumFractionDigits: 6,
        })
    },
    slippage(): string {
      return `(${new Decimal(this.$accessor.swap.slippage)
        .mul(100)
        .toString()}%)`
    },
    minReturnAmount(): string {
      const minReturnAmount = this.$helpers.shortFloatNum(
        this.$accessor.swap.swapPreviewInfos?.minReturnAmount ?? '0',
        6
      )
      const toToken = this.$accessor.swap.toToken
      return `${minReturnAmount} ${toToken?.swapThirdPartySymbol} ${this.slippage}`
    },
    minReturnAmountForUsd(): string {
      const amount =
        this.$accessor.swap.swapPreviewInfos?.minReturnAmount ?? '0'
      const swapPreview = this.$accessor.swap.swapPreviewInfos

      return `$ ${new Decimal(amount)
        .mul(new Decimal(swapPreview?.dstUsdExchange ?? '0'))
        .toNumber()
        .toLocaleString('en-US')} ${this.slippage}`
    },
    bridgeFee(): string {
      const fromChain = this.$accessor.swap.fromChain
      const chains = this.$onboard.supportedNetworks

      const chain = chains.find(
        (item) => Number(item.chainId) === Number(fromChain?.chainID ?? '')
      )

      const { msgFee, msgFeePrice } = this.$accessor.swap.swapPreviewInfos ?? {}

      return this.isUsd.bridgeFee
        ? `$${Number(msgFeePrice ?? '0').toLocaleString('en-US')}`
        : `${this.$helpers.shortFloatNum(
            Number(msgFee ?? '0').toFixed(6),
            6
          )} ${chain?.symbol}`
    },
    isSameChain() {
      return this.$accessor.swap.isSameChain
    },
    options(): { id: string; label: any; value: string }[] {
      return [
        ...[
          {
            id: 'bestQuote',
            label: this.$t('bestQuote'),
            value: this.bestQuote,
          },
          {
            id: 'received',
            label: this.$t('minReceived'),
            value: this.isUsd.received
              ? this.minReturnAmountForUsd
              : this.minReturnAmount,
          },
        ],
        ...(this.isSameChain
          ? []
          : [
              {
                id: 'bridgeFee',
                label: this.$t('bridgeFee'),
                value: this.bridgeFee,
              },
            ]),
        {
          id: 'protocolFee',
          label: this.$t('protocolFee'),
          value: `$${this.protocolFee}`,
        },
      ]
    },
  },
  methods: {
    onSwitch(id: string) {
      this.isUsd[id] = !this.isUsd[id]
    },
  },
})
</script>

<style scoped lang="scss">
::v-deep .switch-icon {
  transform: rotateZ(90deg);
  cursor: pointer;
  padding-bottom: 4px;
  svg {
    fill: $textPrimary;
  }
}
.swap-preview {
  width: 100%;

  .item {
    width: 100%;
    @include flexRsb;
    margin-top: 20px;
    height: 24px;
    .label,
    .value {
      color: $textColor;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 130%;
      @include flexRc;
      user-select: none;
    }
    .value {
      cursor: pointer;
    }
  }
}
</style>
