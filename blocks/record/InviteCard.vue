<template>
  <div class="record-invite-card">
    <div class="header">
      <span class="label-1">{{ referralInfo[0] || '' }}</span>
      <span v-if="referralInfo[1]" class="label-tag">{{
        referralInfo[1]
      }}</span>
    </div>
    <div class="invite-info">
      <div class="infos">
        <div class="referral-info"></div>
        <div class="data">
          <div
            v-for="(item, index) in infoOptions"
            :key="item.id"
            class="data-item"
            :class="{ first: index === 0 }"
          >
            <div class="label">{{ item.label }}</div>
            <div class="value">{{ item.value }}</div>
          </div>
        </div>
      </div>
      <div class="qr-code">
        <img v-if="qrUrl" :src="qrUrl" />
      </div>
    </div>

    <div class="invite-link">
      <div class="label">{{ $t('referralLink') }}</div>
      <div class="link">
        <span>{{ inviteLink }}</span>
        <span class="copy" @click.stop="onCopy">
          <CopyIcon :size="16" />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import QRCode from 'qrcode'
import { SwapSummary } from '~/types/swagger'

export default Vue.extend({
  name: 'RecordInviteCard',
  data() {
    return {
      qrUrl: '',
      referralInfo: [] as string[],
    }
  },
  async fetch() {
    if (!this.userAddress) {
      return
    }

    const referralInfo = await this.$accessor.wallet.getReferralInfo()
    if (referralInfo) {
      this.referralInfo = referralInfo
    }

    await this.$accessor.swap.getSwapSummary()

    const qrUrl = await QRCode.toDataURL(this.inviteLink, {
      color: { light: '#f6f8f9' },
    })
    this.qrUrl = qrUrl
  },
  computed: {
    swapSummary(): SwapSummary {
      return this.$accessor.swap.swapSummary
    },
    inviteLink(): string {
      const url = window.location.origin
      const referralCode = Number(this.swapSummary?.referralCode ?? '0')
        .toString(16)
        .padStart(8, '0')
      return `${url}?r=${referralCode ?? ''}`
    },
    userAddress(): string {
      return this.$accessor.wallet.activeEvmWallet?.accounts[0].address ?? ''
      // return '0x4ECC3c067f3c960FA455374B0188244EF9Dc0B0e'
    },
    infoOptions(): { id: string; label: string; value: string }[] {
      return [
        {
          id: 'code',
          label: this.$t('referralCode').toString(),
          value: Number(this.swapSummary?.referralCode ?? '0')
            .toString(16)
            .padStart(8, '0'),
        },
        {
          id: 'num',
          label: this.$t('totalInvitees').toString(),
          value: this.swapSummary?.invitedTimes ?? '0',
        },
      ]
    },
  },
  methods: {
    onCopy() {
      this.$helpers.copyText(this.inviteLink)
    },
  },
})
</script>

<style scoped lang="scss">
.record-invite-card {
  width: 520px;
  flex-shrink: 0;
  //   height: 100px;
  position: sticky;
  top: 100px;
  border-radius: $radius;
  padding: 20px;
  background-color: $secondary;

  @include phone {
    width: 100%;
    padding: 10px;
  }

  .header {
    width: 100%;
    margin-bottom: 32px;

    @include phone {
      margin-bottom: 14px;
    }
    .label-1 {
      color: $textColor;
      font-size: 20px;
      font-style: normal;
      font-weight: 700;
      line-height: 130%;
    }
    .label-tag {
      height: 20px;
      padding: 0 8px;
      color: var(--111, #7f879e);
      font-family: Poppins;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 130%;
      flex-shrink: 0;
      border-radius: 16px;
      background: rgba(127, 135, 158, 0.1);
      margin-left: 4px;
    }
  }

  .invite-info {
    width: 100%;
    @include flexRc;
    align-items: flex-start;
    justify-content: space-between;

    .infos {
      width: calc(100% - 80px);
      @include flexCc;
      align-items: flex-start;
      justify-content: flex-start;
      .data {
        width: 100%;
        display: flex;
        flex-direction: row;

        .data-item {
          // padding-right: 40px;

          &.first {
            margin-right: 70px;
          }

          .label {
            color: $textColorOp5;
            font-style: normal;
            line-height: 130%;
            margin-bottom: 16px;
            user-select: none;
            font-size: 18px;
            font-style: normal;
            font-weight: 700;
            line-height: 130%;

            @include phone {
              font-size: 12px;
              margin-bottom: 4px;
            }
          }
          .value {
            text-align: left;
            color: $textColor;
            font-size: 24px;
            font-style: normal;
            font-weight: 700;
            line-height: 130%;

            @include phone {
              font-size: 18px;
            }
          }
        }
      }
    }

    .qr-code {
      width: 128px;
      height: 128px;
      flex-shrink: 0;
      background-color: $surface;
      border-radius: $radius;
      overflow: hidden;

      @include phone {
        width: 80px;
        height: 80px;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }

  .invite-link {
    .label {
      color: $textColorOp5;
      font-style: normal;
      line-height: 130%;
      margin-bottom: 16px;
      user-select: none;
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: 130%;

      @include phone {
        font-size: 12px;
        margin-bottom: 4px;
      }
    }
    .link {
      color: $primary;
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: 130%;
      @include phone {
        font-size: 12px;
        line-height: 100%;
      }

      .copy {
        cursor: pointer;
        display: inline-flex;

        ::v-deep svg {
          path {
            stroke: $primary;
          }
        }
      }
    }
  }
}
</style>
