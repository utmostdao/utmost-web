<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12.1666 14.1667C12.1666 13.7525 12.5024 13.4167 12.9166 13.4167H17.9166C18.3308 13.4167 18.6666 13.7525 18.6666 14.1667C18.6666 14.5809 18.3308 14.9167 17.9166 14.9167H12.9166C12.5024 14.9167 12.1666 14.5809 12.1666 14.1667Z"
      fill="#7F879E"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M1.33337 4.16669C1.33337 3.06212 2.22881 2.16669 3.33337 2.16669H16.6667C17.7713 2.16669 18.6667 3.06213 18.6667 4.16669V10.8334C18.6667 11.2476 18.3309 11.5834 17.9167 11.5834C17.5025 11.5834 17.1667 11.2476 17.1667 10.8334V4.16669C17.1667 3.89054 16.9429 3.66669 16.6667 3.66669H3.33337C3.05723 3.66669 2.83337 3.89055 2.83337 4.16669V15.8334C2.83337 16.1095 3.05723 16.3334 3.33337 16.3334H11.8628C12.277 16.3334 12.6128 16.6691 12.6128 17.0834C12.6128 17.4976 12.277 17.8334 11.8628 17.8334H3.33337C2.22881 17.8334 1.33337 16.938 1.33337 15.8334V4.16669Z"
      fill="#7F879E"
    />
    <path
      class="usd"
      d="M9 5.33331V12.6666"
      stroke="#7F879E"
      stroke-width="1"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      class="usd"
      d="M10.8334 6C10.8334 6 9.16181 6 8.33337 6C7.50494 6 6.83337 6.67157 6.83337 7.5C6.83337 8.32843 7.50494 9 8.33337 9"
      stroke="#7F879E"
      stroke-width="1"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      class="usd"
      d="M7.16663 12C7.16663 12 8.83819 12 9.66663 12C10.4951 12 11.1666 11.3284 11.1666 10.5C11.1666 9.67157 10.4951 9 9.66663 9H8.33329"
      stroke="#7F879E"
      stroke-width="1"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M15.5301 11.553C15.823 11.8458 15.823 12.3207 15.5301 12.6136L13.9773 14.1666L15.5303 15.7196C15.8232 16.0125 15.8232 16.4874 15.5303 16.7803C15.2374 17.0732 14.7625 17.0732 14.4696 16.7803L12.3863 14.697C12.0934 14.4041 12.0934 13.9292 12.3863 13.6363L14.4694 11.553C14.7623 11.2601 15.2372 11.2601 15.5301 11.553Z"
      fill="#7F879E"
    />
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ReferralIcon',
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

<style lang="scss" scoped>
svg {
  stroke: none !important;
  transition: 0.4s;

  path {
    stroke: none !important;
    transition: 0.4s;
    fill: $textPrimary !important;

    &.usd {
      fill: none !important;
      stroke: $textPrimary !important;
    }
  }
}
</style>
