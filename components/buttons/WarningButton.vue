<template>
  <el-button
    v-throttle:[0.5]
    type="primary"
    class="warning-button"
    @click="$emit('click')"
  >
    <slot class="button-text"></slot>
  </el-button>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'WarningBotton',
})
</script>

<style lang="scss" scoped>
.warning-button {
  background-color: $background;
  border-color: $background;
  font-size: 14px;
  border-radius: 200px !important;
  font-weight: bold;
  color: $textColorOp5;
  &:hover,
  &:active,
  &:focus {
    // background: color.adjust($tertiary, $birghtness: +5%);
    border-color: $background;
  }
  margin-left: 0 !important;
}
</style>
