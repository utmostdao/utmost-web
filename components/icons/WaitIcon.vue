<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    t="1695714939808"
    class="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    p-id="4032"
    :width="size"
    :height="size"
  >
    <path
      d="M512 0C229.23 0 0 229.23 0 512s229.23 512 512 512 512-229.23 512-512S794.77 0 512 0zM768 620c0 11.044-8.954 20-20 20L404 640c-0.814 0-1.614-0.062-2.402-0.158-1.216-0.146-2.406-0.386-3.544-0.74-0.096-0.032-0.188-0.074-0.284-0.106-7.992-2.62-13.768-10.126-13.768-18.996L384.002 276c0-11.046 8.956-20 20-20l88 0c11.044 0 20 8.954 20 20l0 236 236 0c11.046 0 20 8.956 20 20L768.002 620z"
      p-id="4033"
    />
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'WaitIcon',
  props: {
    size: {
      type: Number,
      default: 72,
    },
  },
})
</script>

<style lang="scss" scoped>
.icon {
  fill: $primary;
  opacity: 0.6;
}
</style>
