<template>
  <div class="swap-history">
    <TopBar :title="$t('history')" class="top-bar">
      <div class="actions">
        <nuxt-link
          :to="localePath({ path: '/', query: $route.query })"
          class="actions-item"
        >
          <HomeIcon />
        </nuxt-link>

        <div class="pages-actions">
          <div
            class="arrow-left"
            :class="{ disabled: $fetchState.pending }"
            @click="onBack"
          >
            <ArrowDownIcon />
          </div>
          <div class="num">
            {{ totalPage === 0 ? 0 : queryParams.pageNo }} / {{ totalPage }}
          </div>
          <div
            class="arrow-right"
            :class="{ disabled: $fetchState.pending }"
            @click="onNext"
          >
            <ArrowDownIcon />
          </div>
        </div>
      </div>
    </TopBar>

    <div class="list-tabs">
      <div
        v-for="item in tabs"
        :key="item.id"
        class="tab"
        :class="{ actived: activedTab === item.id }"
        @click="activedTab = item.id"
      >
        {{ item.label }}
      </div>
    </div>
    <SpinnerLoader
      v-if="$fetchState.pending && !silentFetch"
      style="margin-top: 100px"
    />
    <div v-else class="list">
      <HistoryCard
        v-for="(item, index) in historyList"
        :key="index"
        :infos="item"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SwapRecords } from '~/types/swagger'
export default Vue.extend({
  name: 'HistoryPage',
  async asyncData({ $accessor }) {
    if ($accessor.swap.chainList.length === 0) {
      await $accessor.swap.getChainDetail()
    }
  },
  data() {
    return {
      activedTab: 'all',
      historyList: [] as SwapRecords['items'],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      totalPage: 0,
      silentFetch: false,
      timer: null as NodeJS.Timer | null,
    }
  },
  async fetch() {
    this.removeTimer()
    // 确认缓存中的数据是否已经同步
    const historyList: SwapRecords['items'] = []
    const localeTxs = this.$helpers.getLocalTxHistory(this.userAddress)
    if (localeTxs.length > 0) {
      const confirmRes = await this.$api.yapi.swapRecordConfirmPost({
        confirmDetails: localeTxs.map((item) => ({
          hash: item.swapRecordSrcTxHash ?? '',
          network: item.swapRecordSrcNetwork ?? '',
        })),
      })

      if ((confirmRes?.length ?? 0) > 0) {
        this.$helpers.removeLocalTxHistory(confirmRes ?? [])
      }

      this.$helpers.getLocalTxHistory(this.userAddress).forEach((item) => {
        const _i = historyList.findIndex(
          (t) => t.swapRecordID === item.swapRecordID
        )
        if (_i === -1) {
          historyList.push(item)
        } else {
          historyList.splice(_i, 1, item)
        }
      })
    }

    const status = this.activedTab === 'all' ? undefined : this.activedTab
    const res = await this.$api.yapi.swapRecords({
      ...this.queryParams,
      userAddress: this.userAddress,
      status,
    })

    if (
      !(
        status === this.activedTab ||
        (status === undefined && this.activedTab === 'all')
      )
    ) {
      return
    }

    this.totalPage = res.totalPage
    ;(res.items ?? []).forEach((item) => {
      const _i = historyList.findIndex(
        (t) => t.swapRecordID === item.swapRecordID
      )
      if (_i === -1) {
        historyList.push(item)
      } else {
        historyList.splice(_i, 1, item)
      }
    })

    this.historyList = historyList
    this.setTimer()
  },
  computed: {
    tabs() {
      return [
        { id: 'all', label: this.$t('allLabel') },
        { id: 'PENDING', label: this.$t('underway') },
        { id: 'SUCCESS', label: this.$t('swapCompleted') },
        { id: 'ERROR', label: this.$t('swapFailure') },
      ]
    },
    userAddress(): string {
      return this.$accessor.wallet.activeEvmWallet?.accounts[0]?.address ?? ''
    },
  },
  watch: {
    userAddress() {
      if (this.queryParams.pageNo === 1) {
        this.historyList = []
        this.$fetch()
      } else {
        this.queryParams.pageNo = 1
      }
    },
    activedTab() {
      this.historyList = []
      this.queryParams.pageNo = 1
      this.silentFetch = false
      this.$fetch()
    },
  },
  methods: {
    setTimer() {
      this.silentFetch = false
      if (this.getRouteBaseName() !== 'history') return
      if (this.timer) return
      this.timer = setInterval(() => {
        if (!this.$fetchState.pending) {
          this.silentFetch = true
          this.$fetch()
        }
      }, 10000)
    },
    removeTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    onNext() {
      if (
        this.queryParams.pageNo.toString() === this.totalPage.toString() ||
        this.$fetchState.pending
      ) {
        return
      }
      this.silentFetch = false
      this.queryParams.pageNo += 1
      this.$fetch()
    },
    onBack() {
      if (this.queryParams.pageNo === 1 || this.$fetchState.pending) {
        return
      }
      this.silentFetch = false
      this.queryParams.pageNo -= 1
      this.$fetch()
    },
  },
})
</script>

<style scoped lang="scss">
.swap-history {
  width: 100%;
  height: 100%;

  .top-bar {
    position: sticky;
    top: 75px;
    z-index: 100;
    background-color: $secondary;
    z-index: 101;
    @include phone {
      top: 55px;
    }
  }

  .pages-actions {
    @include flexRc;
    margin-left: 24px;

    .arrow-left,
    .arrow-right {
      width: 25px;
      height: 25px;
      border-radius: 4px;
      border: 1px solid $border;
      cursor: pointer;

      &.disabled {
        opacity: 0.6;
        cursor: no-drop;
      }
    }

    .arrow-left {
      transform: rotateZ(90deg);
    }

    .num {
      color: $textColorOp5;
      text-align: center;
      font-family: Poppins;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 130%;
      margin: 0 4px;
    }
    .arrow-right {
      transform: rotateZ(-90deg);
    }
  }

  .list-tabs {
    padding: 20px 0;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    justify-items: center;
    position: sticky;
    top: 110px;
    z-index: 100;
    background-color: $secondary;
    user-select: none;
    @include phone {
      top: 90px;
    }

    .tab {
      color: $textColorOp5;
      text-align: center;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 130%;
      position: relative;
      cursor: pointer;
      transition: 0.3s;

      &:hover {
        color: $primary;
        transition: 0.3s;
      }
      &.actived {
        color: $primary;
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 130%;
        transition: 0.3s;

        &::before {
          content: '';
          width: 100%;
          height: 3px;
          background-color: $primary;
          position: absolute;
          bottom: -4px;
          border-radius: 8px;
        }
      }
    }
  }

  .list {
    width: 100%;
  }
}
</style>
