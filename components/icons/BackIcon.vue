<template>
  <svg
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <title>Back</title>
    <polygon
      points="22.2109984 10.0935911 6.95247519 10.0935911 12.6790471 4.36393541 10.767106 2.45507812 3.67750517 9.54467895 3.67442139 9.5385114 1.7655641 11.4535362 3.67442139 13.3716449 3.67750517 13.3654773 10.767106 20.4550781 12.6790471 18.5462208 6.95247519 12.8165652 22.2109984 12.8165652"
    ></polygon>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'BackIcon',
  props: {
    size: {
      type: Number,
      default: 24,
    },
  },
})
</script>
