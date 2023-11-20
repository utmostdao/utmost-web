<template>
  <div class="swap-preview-from-to">
    <div class="from">
      <div class="logo">
        <TokenImageCard
          :src="
            $helpers.generateImgUrl(
              fromTokenInfo && fromTokenInfo.swapTokenIcon
            )
          "
          :size="34"
          class="token-icon"
        />
        <TokenImageCard
          :src="
            $helpers.generateImgUrl(fromChainInfo && fromChainInfo.chainIcon)
          "
          :size="18"
          class="network-icon"
        />
      </div>

      <div class="info">
        <span>
          <div class="token">
            {{ fromTokenInfo && fromTokenInfo.swapThirdPartySymbol }}
          </div>
          <div class="network">
            {{ fromChainInfo && fromChainInfo.netWorkName }}
          </div>
        </span>
        <span>
          <div class="token-amount">
            {{ amount('from') }}
          </div>
          <div class="token-legal">≈ ${{ legalAmount('from') }}</div>
        </span>
      </div>
    </div>

    <div class="from-to-infos">
      <ArrowIcon />
    </div>

    <div class="to">
      <div class="logo">
        <TokenImageCard
          :src="
            $helpers.generateImgUrl(toTokenInfo && toTokenInfo.swapTokenIcon)
          "
          :size="34"
          class="token-icon"
        />
        <TokenImageCard
          :src="$helpers.generateImgUrl(toChainInfo && toChainInfo.chainIcon)"
          :size="18"
          class="network-icon"
        />
      </div>

      <div class="info">
        <span>
          <div class="token">
            {{ toTokenInfo && toTokenInfo.swapThirdPartySymbol }}
          </div>
          <div class="network">
            {{ toChainInfo && toChainInfo.netWorkName }}
          </div></span
        >
        <span>
          <div class="token-amount">
            {{ amount('to') }}
          </div>
          <div class="token-legal">≈ ${{ legalAmount('to') }}</div>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SwapChainDetails, SwapTokens } from '~/types/swagger'

export default Vue.extend({
  name: 'SwapPreviewFromTo',
  data() {
    return {}
  },
  computed: {
    fromTokenInfo(): SwapTokens['items'][0] | undefined {
      return this.$accessor.swap.fromToken
    },
    toTokenInfo(): SwapTokens['items'][0] | undefined {
      return this.$accessor.swap.toToken
    },
    fromChainInfo(): SwapChainDetails[0] | undefined {
      return this.$accessor.swap.fromChain
    },
    toChainInfo(): SwapChainDetails[0] | undefined {
      return this.$accessor.swap.toChain
    },
  },
  methods: {
    legalAmount(type: 'from' | 'to'): string {
      if (type === 'from') {
        return this.$helpers.shortFloatNum(
          this.$accessor.swap.fromAmountToLegal,
          3
        )
      } else {
        return this.$helpers.shortFloatNum(
          this.$accessor.swap.toAmountToLegal,
          3
        )
      }
    },
    amount(type: 'from' | 'to') {
      if (type === 'from') {
        return this.$accessor.swap.amount?.toString()
      } else {
        return this.$helpers.shortFloatNum(
          this.$accessor.swap.swapPreviewInfos?.expectedReturnAmount ?? '0',
          6
        )
      }
    },
  },
})
</script>

<style scoped lang="scss">
.swap-preview-from-to {
  width: 100%;
  @include flexCc;

  .from-to-infos {
    // width: 100%;
    position: relative;
    @include flexRc;
    margin: 10px 0;
    // transform: rotateZ(-90deg);
    // margin: 0 20px;
    // &::before {
    //   content: '';
    //   width: 50%;
    //   height: 2px;
    //   background-color: $border;
    // }
  }

  .to,
  .from {
    width: 100%;
    @include flexRc;
    background-color: $surface;
    padding: 8px;
    border-radius: $radius;
    margin: 4px 0;

    .logo {
      width: 36px;
      height: 36px;
      position: relative;
      .network-icon {
        width: 18px;
        height: 18px;
        position: absolute;
        bottom: -4px;
        right: -4px;
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

        // &::before {
        //   content: '';
        //   background-color: $surface;
        //   position: absolute;
        //   top: 0;
        //   left: 0;
        //   width: 100%;
        //   height: 100%;
        // }
      }
    }

    .token-legal {
      text-align: end;
      color: $textColorOp5;
      font-size: 12px;
      font-weight: 400;
      line-height: 130%;
    }

    .token-amount {
      text-align: end;
      color: $textColor;
      font-size: 16px;
      font-weight: 700;
      line-height: 130%;
    }

    .token-amount,
    .token-legal {
      display: flex;
      justify-content: flex-end;
    }

    .info {
      width: calc(100% - 36px);
      margin-left: 12px;
      @include flexRsb;
      align-items: flex-start;

      &.info-to {
        align-items: flex-end;
        margin-right: 12px;
      }
      .token {
        font-size: 16px;
        font-weight: 700;
      }

      .network {
        font-size: 10px;
        font-weight: 500;
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
</style>
