<template>
  <svg
    t="1666861942256"
    class="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="6522"
    :width="size"
    :height="size"
  >
    <path
      d="M512 64C256 64 51.2 272 51.2 524.8s208 460.8 460.8 460.8 460.8-208 460.8-460.8S768 64 512 64z m0 876.8C284.8 940.8 99.2 755.2 99.2 528S284.8 115.2 512 115.2 924.8 300.8 924.8 528 742.4 940.8 512 940.8z"
      :fill="color"
      p-id="6523"
    ></path>
    <path
      d="M809.6 544H531.2V262.4c0-12.8-9.6-22.4-22.4-22.4-12.8 0-22.4 9.6-22.4 22.4v307.2c0 12.8 9.6 22.4 22.4 22.4h300.8c12.8 0 22.4-9.6 22.4-22.4 0-16-9.6-25.6-22.4-25.6z"
      :fill="color"
      p-id="6524"
    ></path>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'TimeIcon',
  props: {
    size: {
      type: Number,
      default: 24,
    },
    color: {
      type: String,
      default: '#000',
    },
  },
})
</script>
