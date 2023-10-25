<template>
  <el-button v-throttle:[0.5] class="select-button" @click="$emit('click')">
    <slot class="button-text"></slot>
  </el-button>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'SelectBotton',
})
</script>

<style lang="scss" scoped>
.select-button {
  padding: 5px 10px 5px 5px;
  border-radius: $radius;
  height: 40px;
  font-size: 12px;
  line-height: 17px;
  font-weight: 400;
  text-align: center;
  background-color: $secondary;
  border: 0px;
  color: $textColorOp8;
  @include singleLine();
  &:hover,
  &:active,
  &:focus {
    color: $textColorOp8;
    border: 0px;
    background: $secondary;
    opacity: 0.8;
  }
  margin-left: 0 !important;
}
</style>
