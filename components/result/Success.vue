<template>
  <div class="result-success">
    <div class="achieve-icon">
      <success-icon />
    </div>
    <div class="text">{{ $t('result.success') }}</div>
    <div class="from"></div>
    <div class="icon"></div>
    <div class="to"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ResultSucceess',
})
</script>

<style scoped lang="scss">
.result-success {
  width: 100%;
  @include flexCc;
  .achieve-icon {
    margin-top: 61px;
    height: 72px;
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
  .icon {
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
