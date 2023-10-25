<template>
  <div class="swap-results">
    <TopBar title="Swap Receipt"></TopBar>

    <div class="content">
      <UtmostLogo class="logo" />

      <div class="tips">
        <div class="label">{{ $t('swapResults.label', { time: time }) }}</div>
        <div class="des" v-html="$t('swapResults.tip')"></div>
      </div>

      <div class="tx-line">
        <div class="from" :class="{ completed: isCompleted }">
          <SuccessIcon :size="24" />
          <div class="infos">
            <div class="infos-title">
              {{ $t('swapResults.fromTitle') }}
              <span @click.stop="onJump('from')">
                <JumpIcon :size="14" class="jump-icon" />
              </span>
            </div>
            <div class="infos-des">
              {{ $t('swapResults.fromDes', srcDes) }}
            </div>
          </div>
        </div>
        <div class="to">
          <SuccessIcon v-if="isCompleted" :size="24" />
          <WaitIcon v-else class="loading" :size="24" />
          <div class="infos">
            <div class="infos-title">
              {{ $t('swapResults.toTitle') }}
              <span v-if="isCompleted" @click.stop="onJump('to')">
                <JumpIcon :size="14" class="jump-icon" />
              </span>
            </div>
            <div class="infos-des">
              {{ $t('swapResults.fromDes2', dstDes) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <SwapConfirm type="results" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SwapRecords } from '~/types/swagger'

export default Vue.extend({
  name: 'SwapResults',
  data() {
    return {
      confirmResults: [] as SwapRecords['items'],
      historyBtnEl: undefined as HTMLElement | null | undefined,
    }
  },
  async fetch() {
    if (this.isCompleted) return
    const { fromChain, txResults } = this.$accessor.swap

    const res = await this.$api.yapi.swapRecords({
      pageNo: 1,
      pageSize: 1,
      userAddress: this.userAddress ?? '',
      network: fromChain?.swapNetwork,
      hash: txResults?.transactionHash ?? '',
    })

    this.confirmResults = res.items

    if (!this.isCompleted) {
      this.timeout()
    }
  },
  computed: {
    userAddress(): string | undefined {
      return this.$accessor.wallet.activeEvmWallet?.accounts?.[0].address
    },
    srcDes(): any {
      const { amount, fromToken, fromChain } = this.$accessor.swap
      return {
        srcAmount: amount,
        srcToken: fromToken?.swapThirdPartySymbol,
        srcNetworkName: fromChain?.netWorkName,
      }
    },
    dstDes(): any {
      const { toToken, swapPreviewInfos, toChain } = this.$accessor.swap
      return {
        estimatedReturnAmount: this.$helpers.shortFloatNum(
          swapPreviewInfos?.expectedReturnAmount ?? '0',
          6
        ),
        dstToken: toToken?.swapThirdPartySymbol,
        dstNetworkName: toChain?.netWorkName,
      }
    },
    time(): number {
      if (this.isSameChain) return 0
      const fromChian = this.$accessor.swap.fromChain
      return (
        this.$onboard.supportedNetworks.find(
          (item) => Number(item.chainId) === Number(fromChian?.chainID)
        )?.bridgetime ?? 0
      )
    },
    isSameChain(): boolean {
      return this.$accessor.swap.isSameChain
    },
    isCompleted(): boolean {
      if (this.isSameChain) return true
      const { txResults } = this.$accessor.swap

      if (this.confirmResults.length === 0) return false

      return !!(this.confirmResults ?? []).find((item) => {
        return (
          item.swapRecordSrcTxHash?.toLowerCase() ===
            txResults?.transactionHash.toLowerCase() && item.swapRecordDstTxHash
        )
      })
    },
  },
  mounted() {
    this.historyBtnEl = document.getElementById('history-page')
    this.historyBtnEl?.addEventListener?.('click', this.goHistory)
  },
  deactivated() {
    this.historyBtnEl?.removeEventListener?.('click', this.goHistory)
  },
  methods: {
    goHistory() {
      this.$router.replace(
        this.localePath({ path: '/history', query: this.$route.query })
      )
    },
    timeout() {
      if (this.getRouteBaseName() !== 'index-results') return
      if (this.isCompleted) return
      setTimeout(() => {
        this.$fetch()
      }, 4000)
    },
    onJump(type: 'from' | 'to') {
      const { fromChain, toChain, isSameChain, txResults } = this.$accessor.swap

      if (isSameChain) {
        // ....
        this.$helpers.jumpToScan(
          Number(fromChain?.chainID!),
          txResults?.transactionHash ?? ''
        )
      } else if (type === 'from') {
        //
        this.$helpers.jumpToScan(
          Number(fromChain?.chainID!),
          txResults?.transactionHash ?? ''
        )
      } else {
        ///
        const info = this.confirmResults[0]
        this.$helpers.jumpToScan(
          Number(toChain?.chainID!),
          info.swapRecordDstTxHash ?? ''
        )
      }
    },
  },
})
</script>

<style scoped lang="scss">
.swap-results {
  width: 100%;
  height: 100%;
  @include flexCsb;
  align-items: flex-start;

  .content {
    width: 100%;
    height: 100%;
    @include flexCc;
    justify-content: flex-start;
    .logo {
      width: 80px;
      height: 80px;
    }

    .tips {
      margin-top: 10px;
      .label {
        font-size: 16px;
        font-weight: bold;
        color: $textColor;
        text-align: center;
      }

      .des {
        margin-top: 6px;
        font-size: 14px;
        font-weight: 500;
        color: $textColorOp8;
        text-align: center;
        white-space: break-spaces;
        line-height: 1.3;
      }
    }

    .tx-line {
      width: 100%;
      padding: 20px;
      margin-top: 20px;
      border-radius: $radius;
      background-color: $surface;

      .from {
        padding-bottom: 30px;
        position: relative;

        &::before {
          content: '';
          height: calc(100% - 24px);
          border-left: 3px dotted $textColorOp5;
          position: absolute;
          top: 30px;
          left: 11px;
        }

        &.completed {
          &::before {
            border-left: 2px solid $textColorOp5;
          }
        }
      }
      .from,
      .to {
        width: 100%;
        @include flexRc;
        justify-content: flex-start;
        .infos {
          width: calc(100% - 26px);
          margin-left: 10px;
          .infos-title {
            font-size: 14px;
            line-height: 1.2;
            font-weight: bold;
            color: $textColor;
            display: inline-flex;

            .jump-icon {
              margin-left: 4px;
              cursor: pointer;
            }
          }
          .infos-des {
            font-size: 12px;
            line-height: 1.4;
            font-weight: 500;
            color: $textColorOp8;
          }
        }

        .loading {
          display: inline-flex;
        }
      }
    }
  }
}
</style>
