<template>
  <div class="result-loading">
    <div class="text">{{ $t('result.search') }}</div>
    <spinner-loader class="loading-icon" :size="60"> </spinner-loader>
    <div class="sub-text">{{ $t('result.noClose') }}</div>
    <div class="button">
      <plain-button @click="cancel">{{ $t('back') }}</plain-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ResultLoading',
  methods: {
    cancel() {
      this.$emit('back')
    },
  },
})
</script>

<style scoped lang="scss">
.result-loading {
  height: 500px;
  position: relative;
  padding: 10px 20px;
  .text {
    margin-top: 100px;
    margin-bottom: 50px;
    text-align: center;
    color: $textColor;
  }
  .sub-text {
    margin-top: 40px;
    font-size: 12px;
    text-align: center;
    color: $textColorOp5;
  }
  .button {
    margin-top: 100px;
    position: relative;
    width: 100%;
  }
  .plain-button {
    height: 100%;
    width: 100%;
  }
}
</style>
