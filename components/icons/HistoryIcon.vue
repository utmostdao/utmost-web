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
        d="M2.42432 2.80304V5.83334H5.45462"
        stroke="#7F879E"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        id="Vector_2"
        d="M1.66666 10C1.66666 14.6024 5.39761 18.3334 9.99999 18.3334C14.6024 18.3334 18.3333 14.6024 18.3333 10C18.3333 5.39765 14.6024 1.66669 9.99999 1.66669C6.91582 1.66669 4.22295 3.34215 2.78198 5.83256"
        stroke="#7F879E"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        id="Vector_3"
        d="M10.0021 5L10.0016 10.0037L13.5347 13.5368"
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
  name: 'HistoryIcon',
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
