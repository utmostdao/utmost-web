<template>
  <div class="trading-card">
    <div class="title">{{ title }}</div>
    <div class="body">
      <div class="input-bar">
        <div class="input">
          <slot name="input" />
        </div>
        <el-image
          v-if="selectedToken"
          :src="selectedToken.swapTokenIcon"
          :alt="selectedToken.swapTokenSymbol"
          class="icon"
        >
          <div slot="error" class="image-slot"></div>
        </el-image>
        <div
          v-if="selectedToken && !selectedToken.swapTokenSymbol"
          class="select"
          @click="selectToken"
        >
          <div class="selected">
            <div>{{ $t('select') }}</div>
          </div>
          <drop-icon />
        </div>
        <div v-else class="select" @click="selectToken">
          <div v-if="selectedToken" class="selected">
            <div>{{ selectedToken.swapTokenSymbol }}</div>
          </div>
          <drop-icon />
        </div>
      </div>
      <div v-if="isTop" class="balance">
        <slot name="balance" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { $vfm } from 'vue-final-modal-types'
import { Token } from '~/types/api'

export default Vue.extend({
  name: 'TradingCard',
  props: {
    title: {
      type: String,
      required: true,
    },
    tokenType: {
      type: String,
      required: true,
    },
    isTop: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    selectedToken(): Token | undefined {
      if (this.tokenType === 'From') {
        return this.$accessor.swap.fromToken
      } else {
        return this.$accessor.swap.toToken
      }
    },
  },
  methods: {
    selectToken() {
      $vfm.show('token-dialog', this.tokenType)
    },
  },
})
</script>

<style scoped lang="scss">
@use 'sass:color';
.trading-card {
  width: 100%;
  padding: 12px 0;
  border-radius: 10px;
  .title {
    height: 20px;
    margin-bottom: 8px;
    color: $textColor;
  }
  .body {
    background: $background;
    padding: 12px;
    border-radius: 6px;
    border: 1px solid $border;
    .input-bar {
      @include flexR;
      @include flexRGap(4px);
      .input {
        width: 60%;
        @include flexR;
        position: relative;
        margin-right: auto;
        font-size: 24px;
        font-weight: 500;
        line-height: 33px;
      }
      .icon {
        width: 16px;
        height: 16px;
      }
      .select {
        height: 24px;
        font-size: 14px;
        line-height: 14px;
        text-align: center;
        white-space: nowrap;
        @include flexR;
        cursor: pointer;
        .selected {
          color: $textColorOp8;
          font-size: 14px;
          line-height: 14px;
          text-align: right;
          white-space: nowrap;
          margin-right: 4px;
        }
      }
    }
  }
  .balance {
    height: 12px;
    font-size: 12px;
    line-height: 12px;
    margin-top: 13px;
    color: $textColorOp5;
  }
}
::v-deep .el-input__inner {
  border: none;
  height: 33px !important;
  padding: 0;
}
::v-deep .el-input.is-disabled .el-input__inner {
  background-color: transparent;
}
::v-deep .el-image__error {
  color: $secondary;
  background-color: $secondary;
  cursor: default;
}
</style>
