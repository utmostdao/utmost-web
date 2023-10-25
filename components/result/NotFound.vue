<template>
  <div class="result-not-found">
    <div class="icon">!</div>
    <div class="text">{{ $t('result.notFound') }}！</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ResultNotFound',
})
</script>

<style scoped lang="scss">
.result-not-found {
  @include flexCc;
  padding: 143px 60px;
  .icon {
    width: 70px;
    height: 70px;
    text-align: center;
    font-size: 60px;
    margin-bottom: 22px;
    color: $secondary;
    background-color: #ff4d4f;
    border-radius: 50%;
    cursor: default;
  }
  .text {
    text-align: center;
    font-size: 14px;
    min-width: 200px;
    font-weight: 400;
    color: #8c8c8c;
    line-height: 20px;
  }
}
</style>
