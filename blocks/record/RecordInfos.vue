<template>
  <div class="record-infos">
    <TopBar :title="$t('commissionTitle')">
      <nuxt-link
        :to="localePath({ path: '/', query: $route.query })"
        class="actions-item"
      >
        <HomeIcon />
      </nuxt-link>
    </TopBar>
    <div class="infos">
      <div
        v-for="option in infoOptions"
        :key="option.id"
        class="infos-item"
        :class="{ link: option.id === 'claimable' && false }"
      >
        <div class="label">{{ option.label }}</div>
        <el-tooltip :disabled="!option.origin" :content="option.origin">
          <div class="value">
            {{ option.value }}
          </div>
        </el-tooltip>
      </div>
    </div>

    <RecordTable />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SwapSummary } from '~/types/swagger'

export default Vue.extend({
  name: 'RecordInfos',
  data() {
    return {}
  },
  async fetch() {
    await this.$accessor.swap.getSwapSummary()
  },
  computed: {
    swapSummary(): SwapSummary {
      return this.$accessor.swap.swapSummary
    },
    userAddress(): string | undefined {
      return this.$accessor.wallet.activeEvmWallet?.accounts[0].address
    },
    infoOptions(): {
      id: string
      label: string
      value: string
      origin?: string
    }[] {
      const all = this.swapSummary?.allRebated ?? '0'
      const ratio = this.swapSummary?.rebateRatio ?? '0'
      const unpayed = this.swapSummary?.unpaid ?? '0'
      return [
        {
          id: 'accumulated',
          label: this.$t('accumulated').toString(),
          value: `$ ${Number(all).toLocaleString('en-US', {
            maximumFractionDigits: 3,
            minimumFractionDigits: 3,
          })}`,
          origin: all,
        },
        { id: 'ratio', label: this.$t('ratio').toString(), value: `${ratio}` },
        {
          id: 'claimable',
          label: this.$t('claimable').toString(),
          value: `$ ${Number(unpayed).toLocaleString('en-US', {
            maximumFractionDigits: 3,
            minimumFractionDigits: 3,
          })}`,
          origin: unpayed,
        },
      ]
    },
  },
  methods: {
    valueStyle(val: string) {
      if (val.length > 15) {
        return { fontSize: '12px' }
      }
      if (val.length > 10) {
        return { fontSize: '14px' }
      }
      if (val.length > 8) {
        return { fontSize: '16px' }
      }
      if (val.length > 5) {
        return { fontSize: '18px' }
      }
      return {}
    },
  },
})
</script>

<style scoped lang="scss">
.record-infos {
  width: 100%;

  .infos {
    height: 100px;
    margin: 20px 0;
    padding: 10px;
    border-radius: $radius;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    background-color: $surface;
    transition: 0.3s;

    @include phone {
      height: 80px;
    }

    .infos-item {
      height: 100%;
      @include flexCc;
      position: relative;
      align-items: center;
      justify-content: space-evenly;

      &.link {
        cursor: pointer;
        .label,
        .value {
          color: $primary !important;
        }
      }

      &.divider {
        &::after {
          content: '';
          height: 80%;
          width: 1px;
          position: absolute;
          background-color: $border;
          right: -0.5px;
          z-index: 1;
        }
      }

      .label {
        color: $textColorOp5;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 130%;
        user-select: none;
        transition: 0.3s;

        @include phone {
          font-size: 12px;
        }
      }

      .value {
        font-weight: bold;
        color: $textColor;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: 130%;
        transition: 0.3s;
        cursor: pointer;
        @include phone {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
