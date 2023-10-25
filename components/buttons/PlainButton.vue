<template>
  <el-button class="plain-button" @click="$emit('click')">
    <slot class="button-text"></slot>
  </el-button>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'PlainBotton',
})
</script>

<style lang="scss" scoped>
.plain-button {
  background-color: $secondary;
  border: 1px solid $primary;
  font-size: 14px;
  border-radius: 10px !important;
  font-weight: bold;
  color: $primary;
  &:hover,
  &:active,
  &:focus {
    background-color: $secondary;
    border-color: darken($primary, 15) !important;
    color: darken($primary, 15) !important;
  }
}
</style>
