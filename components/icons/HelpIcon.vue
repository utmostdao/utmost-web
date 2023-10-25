<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
  >
    <g id="Help">
      <path
        id="Vector"
        d="M12 22C14.7614 22 17.2614 20.8807 19.0711 19.0711C20.8807 17.2614 22 14.7614 22 12C22 9.2386 20.8807 6.7386 19.0711 4.92893C17.2614 3.11929 14.7614 2 12 2C9.2386 2 6.7386 3.11929 4.92893 4.92893C3.11929 6.7386 2 9.2386 2 12C2 14.7614 3.11929 17.2614 4.92893 19.0711C6.7386 20.8807 9.2386 22 12 22Z"
        stroke="#7F879E"
        stroke-width="2"
        stroke-linejoin="round"
      />
      <path
        id="Vector_2"
        d="M12 14.3125V12.3125C13.6568 12.3125 15 10.9693 15 9.3125C15 7.65565 13.6568 6.3125 12 6.3125C10.3432 6.3125 9 7.65565 9 9.3125"
        stroke="#7F879E"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        id="Vector_3"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 18.8125C12.6904 18.8125 13.25 18.2529 13.25 17.5625C13.25 16.8722 12.6904 16.3125 12 16.3125C11.3097 16.3125 10.75 16.8722 10.75 17.5625C10.75 18.2529 11.3097 18.8125 12 18.8125Z"
        fill="#7F879E"
      />
    </g>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'HelpIcon',
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
