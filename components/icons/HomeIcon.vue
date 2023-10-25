<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g>
      <path
        id="Vector"
        d="M14.6666 14.6666V6.66665L7.99992 1.33331L1.33325 6.66665V14.6666H5.33325V8.66665H10.6666V14.6666H14.6666Z"
        stroke="#7F879E"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <path
        id="Vector_2"
        d="M8 14.6666V11.3333"
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
  name: 'HomeIcon',
  props: {
    color: {
      type: String,
      default: '#8c8c8c',
    },
    size: {
      type: Number,
      default: 16,
    },
  },
})
</script>

<style lang="scss" scoped></style>
