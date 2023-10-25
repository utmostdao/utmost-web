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
        d="M4.33337 4.14395V2.60425C4.33337 2.08648 4.75311 1.66675 5.27087 1.66675H13.3959C13.9136 1.66675 14.3334 2.08648 14.3334 2.60425V10.7292C14.3334 11.247 13.9136 11.6667 13.3959 11.6667H11.8388"
        stroke="#7B57E0"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        id="Vector_2"
        d="M10.7291 4.33325H2.60413C2.08636 4.33325 1.66663 4.75299 1.66663 5.27075V13.3958C1.66663 13.9135 2.08636 14.3333 2.60413 14.3333H10.7291C11.2469 14.3333 11.6666 13.9135 11.6666 13.3958V5.27075C11.6666 4.75299 11.2469 4.33325 10.7291 4.33325Z"
        stroke="#7B57E0"
        stroke-linejoin="round"
      />
    </g>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'CopyIcon',
  props: {
    size: {
      type: Number,
      default: 24,
    },
  },
})
</script>
