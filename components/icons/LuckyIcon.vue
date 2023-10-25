<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 20 20"
    fill="none"
  >
    <g id="Financing-one">
      <path
        id="Vector"
        d="M6.25005 5.99365C7.96896 6.66674 10.0035 6.66674 10.0035 6.66674C10.0035 6.66674 12.0334 6.66674 13.75 5.99365C15.6258 8.18274 16.9402 11.0686 17.8041 13.499C18.6787 15.9595 16.7503 18.3334 14.139 18.3334H5.84159C3.23678 18.3334 1.31083 15.9704 2.181 13.5152C3.04085 11.0892 4.35621 8.20232 6.25005 5.99365Z"
        stroke="#7F879E"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <path
        id="Vector_2"
        d="M7.5 11.6667H12.5"
        stroke="#7F879E"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        id="Vector_3"
        d="M7.5 14.1667H12.5"
        stroke="#7F879E"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        id="Vector_4"
        d="M10.0037 11.6667V15.8334"
        stroke="#7F879E"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        id="Vector_5"
        d="M12.5 9.16669L10 11.6667L7.5 9.16669"
        stroke="#7F879E"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        id="Vector_6"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10 6.66669C12.9916 6.66669 15.4167 5.5474 15.4167 4.16669C15.4167 2.78597 12.9916 1.66669 10 1.66669C7.0085 1.66669 4.58337 2.78597 4.58337 4.16669C4.58337 5.5474 7.0085 6.66669 10 6.66669Z"
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
  name: 'LuckyIcon',
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
