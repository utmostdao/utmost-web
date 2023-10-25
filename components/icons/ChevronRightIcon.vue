<template>
  <svg
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    stroke-width="2"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ChevronRightIcon',
  props: {
    size: {
      type: Number,
      default: 24,
    },
  },
})
</script>

<style lang="scss" scoped>
svg {
  stroke: $textColor;
  opacity: 0.6;
}
</style>
