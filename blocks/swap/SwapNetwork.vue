<template>
  <div class="swap-network" :class="{ 'network-to': type === 'to' }">
    <div class="left">
      <div class="title">
        {{ networkTitle }}
      </div>
      <el-input
        v-debounce:2000="$accessor.swap.refreshData"
        :value="amount"
        class="input"
        :disabled="type === 'to'"
        placeholder="0.0"
        @input="onInput"
      />
      <div class="bottom">
        <span v-if="previewFetching"> - </span>
        <span v-else>≈ ${{ legalAmount }}</span>
      </div>
    </div>

    <div class="right-network" @click.stop="openNetworkDialog">
      <div v-if="chainInfo && tokenInfo" class="network-info">
        <div class="logo">
          <img
            :src="$helpers.generateImgUrl(tokenInfo && tokenInfo.swapTokenIcon)"
            class="token-icon"
          />
          <img
            :src="$helpers.generateImgUrl(chainInfo && chainInfo.chainIcon)"
            class="network-icon"
          />
        </div>

        <div class="info">
          <div class="token">
            {{ tokenInfo && tokenInfo.swapThirdPartySymbol }}
          </div>
          <div class="network">{{ chainInfo && chainInfo.netWorkName }}</div>
        </div>
      </div>

      <div v-else class="label">Select</div>
      <ArrowDownIcon class="arrow-down" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { $vfm } from 'vue-final-modal-types'
import { SwapChainDetails, SwapTokens } from '~/types/swagger'
import { NUM_REG } from '~/utils/constants'

export default Vue.extend({
  name: 'SwapNetwork',
  props: {
    type: {
      type: String,
      required: true,
    } as PropOptions<'from' | 'to'>,
  },
  data() {
    return {
      amount: undefined as undefined | string,
    }
  },
  computed: {
    networkTitle(): string {
      let str = this.$t(this.type).toString()
      if (this.type === 'to') {
        str = `${str}`
      }
      return str
    },
    chainInfo(): SwapChainDetails[0] | undefined {
      switch (this.type) {
        case 'from':
          return this.$accessor.swap.fromChain
        case 'to':
          return this.$accessor.swap.toChain
        default:
          return undefined
      }
    },
    tokenInfo(): SwapTokens['items'][0] | undefined {
      switch (this.type) {
        case 'from':
          return this.$accessor.swap.fromToken
        case 'to':
          return this.$accessor.swap.toToken
        default:
          return undefined
      }
    },
    legalAmount(): string {
      if (this.type === 'from') {
        return this.$helpers.shortFloatNum(
          this.$accessor.swap.fromAmountToLegal,
          3
        )
      } else {
        if (this.previewFetching) {
          return ''
        }
        return this.$helpers.shortFloatNum(
          this.$accessor.swap.toAmountToLegal,
          3
        )
      }
    },
    previewFetching(): boolean {
      return this.$accessor.swap.loadingMap.preview
    },
  },
  watch: {
    amount() {
      if (this.type === 'from') {
        this.$accessor.swap.setAmount(this.amount ? this.amount : undefined)
      }
    },
    previewFetching: {
      deep: true,
      handler() {
        if (this.type === 'to' && this.previewFetching) {
          this.amount = ''
        }
      },
    },
    '$accessor.swap.swapPreviewInfos'() {
      if (this.type === 'to') {
        this.amount = this.$helpers.shortFloatNum(
          this.$accessor.swap.swapPreviewInfos?.expectedReturnAmount ?? '',
          6
        )
      }
    },
    '$accessor.swap.amount'() {
      if (this.type === 'from') {
        const val = this.$accessor.swap.amount
        if (this.amount !== (val ?? '').toString()) {
          this.amount = val ? val.toString() : undefined
        }
      }
    },
  },
  mounted() {
    if (this.type === 'from') {
      this.amount = this.$accessor.swap.amount?.toString()
    } else {
      this.amount = this.$helpers.shortFloatNum(
        this.$accessor.swap.swapPreviewInfos?.expectedReturnAmount ?? '',
        6
      )
    }
  },
  methods: {
    onInput(value: string | undefined) {
      this.amount = value
      if (value && !NUM_REG.test(value)) {
        let dot = 0
        const map = value.split('').filter((s) => {
          if (NUM_REG.test(s)) {
            return true
          }
          if (s === '.' && dot === 0) {
            dot += 1
            return true
          } else {
            return false
          }
        })
        this.amount = map.join('')
      } else {
        this.amount = value
      }
    },
    openNetworkDialog() {
      const userAddress =
        this.$accessor.wallet.activeEvmWallet?.accounts?.[0]?.address
      if (!userAddress) {
        $vfm.show('wallet-panel-dialog')
        return
      }

      const selectedChains = this.chainInfo ? [this.chainInfo] : []
      const selectedTokens = this.tokenInfo ? [this.tokenInfo] : []

      const fromToken = this.$accessor.swap.fromToken
      const toToken = this.$accessor.swap.toToken
      const disabledTokens: any[] = []

      switch (this.type) {
        case 'from':
          toToken && disabledTokens.push(toToken)
          break
        case 'to':
          fromToken && disabledTokens.push(fromToken)
          break
      }

      $vfm.show('network-dialog', {
        onSelect: (chain, token) => {
          switch (this.type) {
            case 'from':
              this.$accessor.swap.setFromChain(chain)
              this.$accessor.swap.setFromToken(token)
              break
            case 'to':
              this.$accessor.swap.setToChain(chain)
              this.$accessor.swap.setToToken(token)
              break
          }

          this.$accessor.swap.refreshData()
        },
        disabledTokens,
        selectedChains,
        selectedTokens,
      })
    },
  },
})
</script>

<style scoped lang="scss">
::v-deep .el-input.is-disabled .el-input__inner {
  cursor: auto;
}
::v-deep .el-input__inner,
::v-deep .el-input.is-disabled .el-input__inner {
  height: 100%;
  border: none;
  background-color: transparent;
  padding: 0;
  font-size: 24px;
  font-weight: 700;
  color: $textColor;
}
.swap-network {
  width: 100%;
  padding: 12px;
  @include flexRsb;
  // margin-bottom: 10px;
  border: 1px solid $surface;
  border-radius: $radius;
  position: relative;
  overflow: hidden;
  background-color: transparent;

  &::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: $surface;
  }
  ::v-deep .el-input__inner {
    border: none !important;
    background-color: transparent !important;
  }

  &.network-to {
    &::after {
      opacity: 0.6;
    }
  }

  .left {
    z-index: 1;
    .title {
      color: $textColor;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 130%;
    }

    .input {
      height: 30px;
      border: none;
      margin: 8px 0 4px 0;
    }

    .bottom {
      color: $textColorOp5;
      font-size: 12px;
      font-weight: 400;
      line-height: 130%;
    }
  }

  .right-network {
    width: 160px;
    min-width: 160px;
    height: 70px;
    border: 1px solid $border;
    padding: 16px;
    background-color: $secondary;
    border-radius: $radius;
    border: 1px solid $border;
    @include flexRsb;
    cursor: pointer;
    z-index: 1;

    .label {
      color: $textColor;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 130%;
    }
    .arrow-down {
      ::v-deep svg {
        fill: $textPrimary;
      }
    }

    .network-info {
      width: calc(100% - 24px);
      @include flexRc;
      .logo {
        width: 36px;
        height: 36px;
        position: relative;
        .network-icon {
          width: 18px;
          height: 18px;
          position: absolute;
          bottom: -3px;
          right: -3px;
          border: 1px solid #fff;
        }
        .token-icon {
          width: 34px;
          height: 34px;
          position: relative;
        }

        .network-icon,
        .token-icon {
          border-radius: 50%;
          object-fit: contain;
          overflow: hidden;

          &::before {
            content: '';
            background-color: $secondary;
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      }

      .info {
        width: calc(100% - 36px);
        margin-left: 12px;
        @include flexCc;
        align-items: flex-start;
        .token {
          font-size: 16px;
          font-weight: 700;
        }
        .network {
          font-size: 10px;
          font-weight: 500;
          margin-top: 6px;
        }

        .token,
        .network {
          color: $textColor;
          line-height: 130%;
          font-style: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
