<template>
  <div class="svg-wrapper" :style="{ width: `${size}px`, height: `${size}px` }">
    <slot :size="iconSize" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IconWrapper',
  props: {
    size: {
      type: [String, Number],
      default: 30,
    },
    iconSize: {
      type: [String, Number],
      default: 18,
    },
  },
})
</script>

<style lang="scss" scoped>
.svg-wrapper {
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
  @include flexRc;
  &:hover {
    // background: darken($background, 10);
  }
}
</style>
