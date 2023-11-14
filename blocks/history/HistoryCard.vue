<template>
  <div class="history-card">
    <div class="top-bar">
      <div class="time">{{ txTime }}</div>

      <div class="status" :class="statusClass">
        {{ $t(infos.swapRecordTxStatus || '') }}
      </div>
    </div>

    <div class="content">
      <div class="chains">
        <div class="item">
          <div class="network">
            <div class="logo">
              <img :src="srcTokenIcon" class="token-icon" />
              <img :src="srcChainIcon" class="network-icon" />
            </div>

            <div class="info">
              {{
                $helpers.shortFloatNum(
                  Number(infos.swapRecordSrcAmount || '0'),
                  6
                )
              }}
              {{ infos.swapRecordSrcTokenSymbol }}
            </div>
          </div>
        </div>
        <div class="arrow">
          <ArrowLeftRightIcon :size="14" />
        </div>
        <div class="item">
          <div v-if="dstChainIcon" class="network">
            <div class="logo">
              <img :src="dstTokenIcon" class="token-icon" />
              <img :src="dstChainIcon" class="network-icon" />
            </div>

            <div class="info">
              {{
                $helpers.shortFloatNum(
                  Number(infos.swapRecordDstAmount || '0'),
                  6
                )
              }}
              {{ infos.swapRecordDstTokenSymbol }}
            </div>
          </div>

          <el-skeleton v-else class="network" animated>
            <template slot="template">
              <el-skeleton-item class="logo" variant="circle" />
              <el-skeleton-item
                class="info"
                style="width: 50px; height: 30px"
                variant="rect"
              />
            </template>
          </el-skeleton>
        </div>
      </div>

      <div class="tx-info">
        <div class="item">
          <div class="label">{{ $t('toTxHash') }}:</div>
          <a class="val" @click="onJump('from')">
            <span>&nbsp;{{ srcHash }}</span>
            <JumpIcon :size="12" class="jump-icon" />
          </a>
        </div>
        <div
          v-if="infos.swapRecordTxStatus !== 'ERROR' && !isSame"
          class="item"
        >
          <div class="label">{{ $t('bridgeTime') }}:</div>
          <div class="val">
            <span>&nbsp;{{ bridgeTime }}</span>
          </div>
        </div>
        <!-- <div v-else-if="!isSame" class="item">
          <div class="label">{{ $t('failureRes') }}:</div>
          <div class="val error">{{ infos.swapRecordErrorMsg }}</div>
        </div> -->
        <div v-if="!isSame" class="item">
          <div class="label">{{ $t('dstHash') }}:</div>
          <a v-if="dstHash !== '-'" class="val" @click="onJump('to')">
            <span>&nbsp;{{ dstHash }}</span>
            <JumpIcon v-if="dstHash" :size="12" class="jump-icon" />
          </a>
          <div v-else class="val">
            {{ dstHash }}
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="order-award">
        <span>{{ $t('orderAward') }}:&nbsp;</span>
        <span class="num">{{ orderAward }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import Vue, { PropOptions } from 'vue'
import { SwapRecords } from '~/types/swagger'

export default Vue.extend({
  name: 'HistoryCard',
  props: {
    infos: {
      type: Object,
      required: true,
    } as PropOptions<SwapRecords['items'][0]>,
  },
  data() {
    return {
      bridgeTime: '',
      timer: undefined as undefined | NodeJS.Timer,
    }
  },
  computed: {
    orderAward() {
      return Number(this.infos.score || '0').toLocaleString('en-US') + ' UTS'
    },
    isSame() {
      return (
        this.infos.swapRecordDstNetwork?.toLowerCase() ===
        this.infos.swapRecordSrcNetwork?.toLowerCase()
      )
    },
    statusClass(): any {
      return {
        'status-success': this.infos.swapRecordTxStatus === 'SUCCESS',
        'status-pending': this.infos.swapRecordTxStatus === 'PENDING',
        'status-error': this.infos.swapRecordTxStatus === 'ERROR',
      }
    },
    srcTokenIcon(): string {
      return this.$helpers.generateImgUrl(this.infos.swapRecordSrcTokenLogo)
    },
    srcChainIcon(): string {
      const chains = this.$accessor.swap.chainList
      const chain = chains.find(
        (item) =>
          item.swapNetwork.toLowerCase() ===
          this.infos.swapRecordSrcNetwork?.toLowerCase()
      )
      return chain?.chainIcon ?? ''
    },
    dstTokenIcon(): string {
      return this.$helpers.generateImgUrl(this.infos.swapRecordDstTokenLogo)
    },
    dstChainIcon(): string {
      const chains = this.$accessor.swap.chainList
      const chain = chains.find(
        (item) =>
          item.swapNetwork.toLowerCase() ===
          this.infos.swapRecordDstNetwork?.toLowerCase()
      )
      return chain?.chainIcon ?? ''
    },
    srcHash(): string {
      const hash = this.infos.swapRecordSrcTxHash
      return hash ? this.$helpers.shortAddress(hash) : '-'
    },
    dstHash(): string {
      const hash = this.infos.swapRecordDstTxHash
      return hash ? this.$helpers.shortAddress(hash) : '-'
    },
    txTime(): string {
      return dayjs(Number(this.infos.swapRecordSrcTxTime)).format(
        'YYYY-MM-DD HH:mm:ss'
      )
    },
  },
  mounted() {
    this.init()
  },
  deactivated() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = undefined
    }
  },
  methods: {
    init() {
      const src = dayjs(Number(this.infos.swapRecordSrcTxTime))
      const dst = this.infos.swapRecordDstTxTime
        ? dayjs(Number(this.infos.swapRecordDstTxTime))
        : dayjs()
      const time = dst.diff(src, 'seconds')
      this.bridgeTime = this.$helpers.generateDiffTime(time)

      if (
        !this.infos.swapRecordDstTxHash &&
        this.infos.swapRecordTxStatus === 'PENDING'
      ) {
        this.timer = setInterval(() => {
          const src = dayjs(Number(this.infos.swapRecordSrcTxTime))
          const dst = dayjs()
          const time = dst.diff(src, 'seconds')
          this.bridgeTime = this.$helpers.generateDiffTime(time)
        }, 1000)
      }
    },
    onJump(type: 'from' | 'to') {
      if (type === 'from') {
        const chain = this.$accessor.swap.chainList.find(
          (item) =>
            item.swapNetwork.toLowerCase() ===
            this.infos.swapRecordSrcNetwork?.toLowerCase()
        )
        this.$helpers.jumpToScan(
          Number(chain?.chainID ?? ''),
          this.infos.swapRecordSrcTxHash ?? ''
        )
      } else {
        const chain = this.$accessor.swap.chainList.find(
          (item) =>
            item.swapNetwork.toLowerCase() ===
            this.infos.swapRecordDstNetwork?.toLowerCase()
        )

        this.$helpers.jumpToScan(
          Number(chain?.chainID ?? ''),
          this.infos.swapRecordDstTxHash ?? ''
        )
      }
    },
  },
})
</script>

<style scoped lang="scss">
.history-card {
  width: 100%;
  padding: 15px 20px;
  position: relative;
  background-color: $surface;
  border-radius: $radius;
  margin-bottom: 20px;

  @include phone {
    margin-bottom: 10px;
    padding: 10px;
  }

  .top-bar {
    width: 100%;
    @include flexRsb;

    .time {
      color: $textColorOp5;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 130%;
    }

    .status {
      text-align: right;
      font-size: 12px;
      font-style: normal;
      font-weight: 700;
      line-height: 130%;

      &.status-success {
        color: $success;
      }

      &.status-pending {
        color: $warning;
      }

      &.status-error {
        color: $error;
      }
    }
  }

  .content {
    width: 100%;
    margin-top: 10px;
    @include flexRc;
    align-items: flex-start;

    .tx-info {
      width: 50%;
      @include phone {
        width: 55%;
      }

      .item {
        color: $textColorOp5;
        text-align: right;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 130%;
        @include flexRc;
        padding: 6px 0;
        justify-content: flex-start;
        white-space: nowrap;
        // .label {
        // }

        @include phone {
          padding: 4px 0;
        }

        .val {
          @include flexRc;
          justify-content: flex-start;
          align-items: normal;

          &.error {
            color: $error;
          }

          .jump-icon {
            margin-left: 2px;
          }
        }
      }
    }
  }

  .chains {
    width: 50%;

    @include phone {
      width: 45%;
    }

    .arrow {
      padding-left: 7px;
      margin: 6px 0;
      @include flexCc;
      align-items: flex-start;

      ::v-deep svg {
        path {
          stroke: $textColor;
        }
      }
    }

    .item {
      width: 100%;

      .network {
        @include flexRc;

        .logo {
          width: 30px;
          height: 30px;
          position: relative;

          @include phone {
            width: 24px;
            height: 24px;
          }

          .network-icon {
            width: 14px;
            height: 14px;
            position: absolute;
            bottom: -2px;
            right: -2px;
            border: 1px solid #fff;

            @include phone {
              width: 12px;
              height: 12px;
              bottom: -2px;
              right: -2px;
            }
          }

          .token-icon {
            width: 28px;
            height: 28px;
            position: relative;

            @include phone {
              width: 24px;
              height: 24px;
            }
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
          margin-left: 18px;
          width: 100%;
          color: $textColor;
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: 130%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          @include phone {
            margin-left: 8px;
            font-size: 12px;
          }
        }
      }
    }
  }

  .footer {
    width: 100%;
    margin-top: 6px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .order-award {
      color: $textColorOp5;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 130%;

      .num {
        color: $warning;
      }
    }
  }
}
</style>
