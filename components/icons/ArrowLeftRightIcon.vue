<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 20 20"
    fill="none"
  >
    <g>
      <path
        id="Vector"
        d="M7.91663 2.49999L7.91663 17.5"
        stroke="#7B57E0"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        id="Vector_2"
        d="M2.91663 7.5L7.91663 2.5"
        stroke="#7B57E0"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        id="Vector_3"
        d="M12.0834 17.1671L12.0834 2.1671"
        stroke="#7B57E0"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        id="Vector_4"
        d="M12.0834 17.1671L17.0834 12.1671"
        stroke="#7B57E0"
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
  name: 'ArrowLeftRightIcon',
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
}
</style>
