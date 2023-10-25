<template>
  <div class="icon">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="size"
      :height="size"
      viewBox="0 0 32 32"
    >
      <title>Loading</title>
      <path
        d="M.5 16h3c0 6.904 5.596 12.5 12.5 12.5S28.5 22.904 28.5 16 22.904 3.5 16 3.5v-3C24.56.5 31.5 7.44 31.5 16c0 8.56-6.94 15.5-15.5 15.5C7.44 31.5.5 24.56.5 16z"
        fill-rule="nonzero"
      ></path>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'SpinnerLoader',
  props: {
    size: {
      type: [Number, String],
      default: 30,
    },
  },
})
</script>

<style lang="scss" scoped>
.icon {
  @include flexRc();
  & > svg {
    animation: spinning 1s infinite linear;
    fill: $primary;
  }
}

@keyframes spinning {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
