<template>
  <svg viewBox="0 0 18 18" :width="size" :height="size">
    <title></title>
    <g
      transform="translate(9.000000, 9.000000) scale(1, -1) rotate(90.000000) translate(-9.000000, -9.000000) "
    >
      <polygon
        fill="#999999"
        fill-rule="nonzero"
        points="8.121 9 11.8335 12.7125 10.773 13.773 6 9 10.773 4.227 11.8335 5.2875"
      ></polygon>
    </g>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AddIcon',
  props: {
    size: {
      type: Number,
      default: 18,
    },
  },
})
</script>

<style lang="scss" scoped></style>
