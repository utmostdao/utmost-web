<template>
  <svg viewBox="0 0 18 18" :width="size" :height="size" class="add-icon">
    <title>Add</title>
    <polygon
      points="8.25 8.25 8.25 3.75 9.75 3.75 9.75 8.25 14.25 8.25 14.25 9.75 9.75 9.75 9.75 14.25 8.25 14.25 8.25 9.75 3.75 9.75 3.75 8.25"
    ></polygon>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AddIcon',
  props: {
    size: {
      type: Number,
      default: 24,
    },
  },
})
</script>

<style lang="scss" scoped>
.add-icon {
  color: $textColorOp8;
}
</style>
