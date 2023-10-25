<template>
  <div class="warning-card">
    <div class="warning-content">{{ content }}</div>
    <warning-button class="button" @click="$emit('click')"
      >Change network</warning-button
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'WarningCard',
  props: {
    content: {
      type: String,
      default: '',
    },
  },
})
</script>

<style lang="scss" scoped>
.warning-card {
  height: 92px;
  padding: 11px 0;
  background: $textColorOp5;
  @include flexCc;
  .warning-content {
    font-size: 14px;
    font-weight: 400;
    color: $background;
    line-height: 20px;
    margin-bottom: 10px;
  }
  .button {
    height: 40px;
  }
}
</style>
