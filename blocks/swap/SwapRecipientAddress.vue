<template>
  <div class="swap-recipient-address" :class="{ preview: isPreview }">
    <div class="item">
      <div class="label">
        {{ $t('recipientAddress') }}
      </div>

      <el-switch
        v-if="!isPreview"
        v-model="openAddress"
        class="switch"
        size="small"
      />
    </div>

    <el-input
      v-if="openAddress"
      v-model="address"
      class="input"
      :placeholder="userAddress"
    />
    <div v-if="isPreview" class="address">
      {{ $helpers.shortAddress(address ? address : userAddress || '', 6) }}
      <span class="copy" @click.stop="onCopy">
        <CopyIcon :size="16" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'SwapRecipientAddress',
  props: {
    isPreview: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      openAddress: false,
      address: this.$accessor.swap.customReceiveAddress as string | undefined,
    }
  },
  computed: {
    userAddress(): string | undefined {
      return this.$accessor.wallet.activeEvmWallet?.accounts?.[0]?.address
    },
  },
  watch: {
    address() {
      this.$accessor.swap.setCustomReceiveAddress(this.address)
    },
  },
  methods: {
    onCopy() {
      this.$helpers.copyText(
        this.address ? this.address : this.userAddress ?? ''
      )
    },
  },
})
</script>

<style scoped lang="scss">
.swap-recipient-address {
  width: 100%;
  margin-top: 20px;

  &.preview {
    @include flexRsb;
    .item {
      width: auto !important;
    }
  }

  .item {
    width: 100%;
    @include flexRsb;
  }

  .input {
    margin-top: 10px;
  }
  .label {
    color: $textColor;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;
  }

  .switch {
    width: 24px;
    height: 24px;
  }

  .address {
    font-size: 12px;
    @include flexRc;

    .copy {
      cursor: pointer;
      display: inline-flex;
      margin-left: 2px;

      ::v-deep svg {
        path {
          stroke: $primary;
        }
      }
    }
  }
}
</style>
