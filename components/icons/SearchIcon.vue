<template>
  <svg
    :width="size"
    :height="size + 1"
    viewBox="0 0 18 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Search">
      <circle
        id="Ellipse_739"
        cx="8.80541"
        cy="8.80547"
        r="7.49047"
        stroke="#7F879E"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        id="Line_181"
        d="M14.0151 14.4043L16.9518 17.3334"
        stroke="#7F879E"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'SearchIcon',
  props: {
    size: {
      type: Number,
      default: 24,
    },
  },
})
</script>

<style lang="scss" scoped></style>
