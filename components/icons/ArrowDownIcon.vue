<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
  >
    <g>
      <path
        id="Vector"
        d="M18 9L12 15L6 9"
        stroke="#7F879E"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ArrowDownIcon',
  props: {
    size: {
      type: Number,
      default: 24,
    },
  },
})
</script>

<style lang="scss" scoped></style>
