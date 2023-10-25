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
        d="M17.5 3.33331V9.99998"
        stroke="#7F879E"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        id="Vector_2"
        d="M2.5 10V16.6667"
        stroke="#7F879E"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        id="Vector_3"
        d="M17.5 10C17.5 5.85787 14.1421 2.5 10 2.5C7.88104 2.5 5.96733 3.37873 4.60338 4.79167M2.5 10C2.5 14.1421 5.85787 17.5 10 17.5C12.0232 17.5 13.8592 16.6989 15.2083 15.3966"
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
  name: 'RefreshIcon',
  props: {
    color: {
      type: String,
      default: '#8c8c8c',
    },
    size: {
      type: Number,
      default: 20,
    },
  },
})
</script>

<style lang="scss" scoped></style>
