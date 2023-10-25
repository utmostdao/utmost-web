<template>
  <svg viewBox="0 0 24 24" :width="size" :height="size" class="close-icon">
    <polygon
      points="12 10.586 16.95 5.636 18.364 7.05 13.414 12 18.364 16.95 16.95 18.364 12 13.414 7.05 18.364 5.636 16.95 10.586 12 5.636 7.05 7.05 5.636"
    ></polygon>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'CloseIcon',
  props: {
    size: {
      type: Number,
      default: 24,
    },
  },
})
</script>

<style lang="scss" scoped>
.close-icon {
  fill: $textColorOp8;
}
</style>
