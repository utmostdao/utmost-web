<template>
  <div class="swap-approve">
    <TopBar title="Swap Approve">
      <nuxt-link
        :to="localePath({ path: '/', query: $route.query })"
        class="actions-item"
      >
        <HomeIcon />
      </nuxt-link>
    </TopBar>

    <div v-if="token" class="body">
      <el-image
        :src="$helpers.generateImgUrl(token.swapTokenIcon)"
        :alt="token.swapThirdPartySymbol"
        class="icon"
      >
        <div slot="error" class="image-error"></div>
      </el-image>
      <div class="text">
        {{ $t('authorizeDialog.swap') }}{{ token.swapThirdPartySymbol }}
      </div>
      <!-- <div class="input">
        <el-input />
      </div> -->
      <!-- <div class="title">
        <div>{{ $t('authorizeDialog.infinitApproval') }}</div>
        <el-switch v-model="maxAllowance" active-color="#6e28fa"> </el-switch>
      </div> -->
    </div>

    <SwapConfirm :max-allowance="maxAllowance" type="approve" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'SwapApprove',
  data() {
    return {
      contractAddress: '',
      loading: false,
      spinnerSize: 20,
      maxAllowance: true,
    }
  },
  computed: {
    token() {
      return this.$accessor.swap.fromToken
    },
    address() {
      return this.$accessor.activeEvmWallet?.accounts[0].address
    },
  },
  methods: {},
})
</script>

<style scoped lang="scss">
.swap-approve {
  width: 100%;
  height: 100%;
  @include flexCsb;

  .body {
    width: 100%;
    margin-top: 50px;
    margin-bottom: 50px;

    .icon {
      margin: 0 calc(50% - 25px);
      width: 50px;
      height: 50px;
    }

    .text {
      margin-top: 14px;
      width: 100%;
      text-align: center;
      height: 20px;
      line-height: 20px;
      color: $textColorOp8;
      font-size: 14px;
      font-weight: 400;
    }

    .title {
      margin: 30px 0;
      color: $textColor;
      font-size: 14px;
      @include flexRsb;
    }
  }
}
</style>
