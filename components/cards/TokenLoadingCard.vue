<template>
  <div class="token-loading">
    <div class="token-icon"></div>
    <div class="token">
      <div class="symbol skeleton"></div>
      <div class="name skeleton"></div>
    </div>
    <div class="token-balance">
      <div class="balance skeleton"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'TokenLoadingCard',
})
</script>

<style scoped lang="scss">
.token-loading {
  @include flexRsb;
  margin-top: 26px;
  cursor: pointer;
  .token-icon {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: $secondary;
    opacity: 0.6;
  }
  .token {
    margin-left: 10px;
    width: 50%;
    height: 34px;
    border-radius: 10px;
    @include flexCsb;

    .symbol {
      height: 60%;
      margin-right: 100px;
      width: calc(100% - 100px);
      font-size: 18px;
      color: $textColorOp8;
      font-weight: 400;
      border-radius: 4px;
    }
    .name {
      height: 30%;
      margin-right: 150px;
      width: calc(100% - 150px);
      font-size: 12px;
      color: $textColorOp5;
      border-radius: 2px;
    }
  }
  .token-balance {
    width: calc(50% - 44px);
    height: 34px;
    text-align: right;
    @include flexCsb;
    .balance {
      height: 60%;
      margin-left: 80px;
      width: calc(100% - 80px);
      font-size: 18px;
      color: $textColorOp8;
      font-weight: 400;
      border-radius: 2px;
    }
    .value {
      height: 30%;
      margin-left: 150px;
      width: calc(100% - 150px);
      font-size: 12px;
      color: $textColorOp5;
    }
  }
}

.skeleton {
  background-color: $secondary;
  animation: skeleton-loading 1.5s linear infinite alternate;
}

@keyframes skeleton-loading {
  0% {
    opacity: 0.6;
  }
  100% {
    opacity: 0.3;
  }
}
</style>
