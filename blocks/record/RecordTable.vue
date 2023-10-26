<template>
  <div
    v-infinite-scroll-body="onScroll"
    :infinite-scroll-distance="200"
    :infinite-scroll-delay="400"
    :infinite-scroll-disabled="
      $fetchState.pending || totalPage <= queryParams.pageNo
    "
    infinite-scroll-immediate="true"
    class="record-table"
  >
    <div class="table-header">
      <div class="tabs">
        <div
          v-for="item in tabs"
          :key="item.id"
          class="tab"
          :class="{ active: activeTab === item.id }"
          @click="activeTab = item.id"
        >
          {{ item.label }}
        </div>
      </div>

      <div class="actions">
        <!-- <PrimaryButton class="confirm-btn" size="mini">
          <template>
            {{ $t('settlement') }}
          </template>
        </PrimaryButton> -->
      </div>
    </div>

    <div class="table-container">
      <div class="columns">
        <div v-for="item in columns" :key="item.id" class="column">
          {{ item.label }}
        </div>
      </div>

      <div
        v-if="recordList.length === 0 && $fetchState.pending"
        class="loading"
      >
        <SpinnerLoader />
      </div>
      <div v-else class="datas">
        <div v-for="(item, index) in recordList" :key="index" class="data-item">
          <div class="item time">
            {{ txTime(item.swapRecordSrcTxTime) }}
          </div>
          <div class="item address">
            {{ $helpers.shortAddress(item.swapRecordUserAddress, 3) }}
          </div>
          <div class="item token">
            <img
              v-if="item.feeTokenLogo"
              :src="$helpers.generateImgUrl(item.feeTokenLogo)"
              class="token-img"
            />
            <span>{{ $helpers.shortFloatNum(item.rebate, 6) }}</span>
            &nbsp;
            <span>{{ item.feeTokenSymbol }}</span>
          </div>
          <div
            class="item jump-icon"
            @click="onJump(item.swapRecordSrcTxHash, item.swapRecordSrcNetwork)"
          >
            <JumpIcon :size="12" />
          </div>
        </div>

        <div class="datas-footer">
          <LoadMore
            :loading="$fetchState.pending"
            :no-more="!(totalPage > queryParams.pageNo)"
            :load-more="true"
            @loadMore="onScroll"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import Vue from 'vue'
import { SwapRebates } from '~/types/swagger'

export default Vue.extend({
  name: 'RecordTable',
  data() {
    return {
      activeTab: 'details',
      recordList: [] as SwapRebates['items'],
      totalPage: 0,
      queryParams: {
        pageNo: 1,
        pageSize: 20,
      },
    }
  },
  async fetch() {
    if (this.$accessor.swap.chainList.length === 0) {
      await this.$accessor.swap.getChainDetail()
    }
    const res = await this.$api.yapi.swapRebates({
      ...this.queryParams,
      userAddress: this.userAddress,
      reverseStatus: 'PENDING',
    })

    this.totalPage = res.totalPage
    this.recordList = [...this.recordList, ...res.items]
  },
  computed: {
    userAddress(): string {
      return this.$accessor.wallet.activeEvmWallet?.accounts[0]?.address ?? ''
    },
    tabs() {
      return [
        { id: 'details', label: this.$t('details') },
        // { id: 'settlement', label: this.$t('settlement') },
      ]
    },
    columns() {
      return [
        { id: 'time', label: this.$t('txTime') },
        { id: 'address', label: this.$t('txAddress') },
        { id: 'token', label: this.$t('commission') },
      ]
    },
  },
  watch: {
    activeTab() {
      this.queryParams.pageNo = 1
      this.recordList = []
      this.$fetch()
    },
  },
  methods: {
    txTime(time: string) {
      return dayjs(Number(time)).format('YY/MM/DD HH:mm')
    },
    onJump(tx: string, chainName: string) {
      const chain = this.$accessor.swap.chainList.find(
        (item) => item.swapNetwork.toLowerCase() === chainName.toLowerCase()
      )
      this.$helpers.jumpToScan(Number(chain?.chainID ?? ''), tx)
    },
    onScroll() {
      if (
        !(this.$fetchState.pending || this.totalPage < this.queryParams.pageNo)
      ) {
        this.queryParams.pageNo += 1
        this.$fetch()
      }
    },
  },
})
</script>

<style scoped lang="scss">
.record-table {
  width: 100%;

  .table-header {
    width: 100%;
    height: 40px;
    @include flexRsb;
    position: sticky;
    top: 80px;
    background-color: $secondary;

    @include phone {
      top: 60px;
    }

    .tabs {
      width: 100%;
      @include flexRc;
      justify-content: flex-start;

      .tab {
        width: 90px;
        height: 24px;
        font-size: 12px;
        font-weight: 400;
        color: $textColorOp5;
        transition: 0.4s;
        @include flexCc;
        cursor: pointer;
        user-select: none;
        position: relative;
        align-items: flex-start;

        &::before {
          content: '';
          width: 1px;
          height: 1px;
          border-radius: 50%;
          position: absolute;
          left: 10px;
          bottom: 0;
          transition: 0.4s;
        }

        &.active {
          color: $primary;
          font-weight: bold;
          transition: 0.4s;
          &::before {
            width: 20%;
            height: 2px;
            border-radius: $radius;
            background-color: $primary;
            transition: 0.4s;
          }
        }
      }
    }
  }

  .table-container {
    width: 100%;
    // margin-top: 10px;

    .columns {
      width: 100%;
      display: grid;
      grid-template-columns: 30% 27% 38% 5%;
      padding: 10px 0;
      position: sticky;
      top: 124px;
      background-color: $secondary;

      @include phone {
        top: 104px;
      }

      .column {
        @include flexCc;
        font-size: 14px;
        font-weight: bold;
        color: $textColor;
        align-items: flex-start;
      }
    }
    .loading {
      width: 100%;
      height: 100px;
      @include flexCc;
    }
    .datas {
      width: 100%;
      @include flexCc;
      align-items: flex-start;
      .data-item {
        width: 100%;
        height: 36px;
        // background-color: antiquewhite;
        margin: 4px 0;
        color: $textColorOp5;
        text-align: center;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 130%;
        display: grid;
        grid-template-columns: 30% 27% 38% 5%;

        .item {
          @include flexRc;
          justify-content: flex-start;

          &.jump-icon {
            cursor: pointer;
            display: inline-flex;
          }

          &.time {
            white-space: nowrap;
          }

          &.token {
            display: flex;
            align-items: center;
            justify-content: flex-start;
          }

          .token-img {
            width: 16px;
            height: 16px;
            object-fit: contain;
            margin-right: 4px;
          }
        }
      }

      .datas-footer {
        width: 100%;
        height: 20px;
        @include flexCc;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
