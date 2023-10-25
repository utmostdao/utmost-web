<template>
  <div class="result-failure">
    <div class="failure-icon">
      <close-icon :size="35"></close-icon>
    </div>
    <div class="text">{{ $t('swapFailure') }}</div>
    <div class="from"></div>
    <div class="arrow-icon"></div>
    <div class="to"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ResultFailure',
})
</script>

<style scoped lang="scss">
.result-failure {
  width: 100%;
  @include flexCc;
  .failure-icon {
    margin-top: 49px;
    width: 72px;
    height: 72px;
    text-align: center;
    font-size: 60px;
    margin-bottom: 22px;
    line-height: 60px;
    color: $secondary;
    background-color: #ff4d4f;
    border-radius: 50%;
    cursor: default;
    @include flexCc;
    svg {
      fill: white;
    }
  }
  .text {
    margin-top: 40px;
    font-size: 14px;
    font-weight: 400;
    color: #8c8c8c;
    line-height: 20px;
  }
  .from {
    @include flexRc;
    height: 20px;
    font-size: 14px;
    font-weight: 500;
    color: $textColor;
    line-height: 20px;
    margin-top: 69px;
    .from-icon {
      width: 18px;
      height: 18px;
      margin: 1px 4px 1px 0;
      background: #bfbfbf;
      border-radius: 50%;
    }
  }
  .arrow-icon {
    margin: 9px 0;
    width: 16px;
    height: 21px;
  }
  .to {
    @include flexRc;
    height: 33px;
    font-size: 24px;
    font-weight: 500;
    color: $textColor;
    line-height: 33px;
    .to-icon {
      width: 26px;
      height: 26px;
      margin: 4px 5px 3px 0;
      background: #bfbfbf;
      border-radius: 50%;
    }
  }
}
</style>
