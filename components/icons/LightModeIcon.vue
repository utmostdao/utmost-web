<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.5752 4.57544L5.6889 5.68915"
      stroke="#7F879E"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M1.5 12H3.075"
      stroke="#7F879E"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M4.5752 19.4247L5.6889 18.311"
      stroke="#7F879E"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M19.4247 19.4247L18.311 18.311"
      stroke="#7F879E"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M22.4998 12H20.9248"
      stroke="#7F879E"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M19.4247 4.57544L18.311 5.68915"
      stroke="#7F879E"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12 1.5V3.075"
      stroke="#7F879E"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12 18C15.3137 18 18 15.3137 18 12C18 8.6863 15.3137 6 12 6C8.6863 6 6 8.6863 6 12C6 15.3137 8.6863 18 12 18Z"
      fill="#7F879E"
      stroke="#7F879E"
      stroke-width="2"
      stroke-linejoin="round"
    />
    <path
      d="M12 22.5V20.925"
      stroke="#7F879E"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DarkModeIcon',
  props: {
    size: {
      type: Number,
      default: 24,
    },
  },
})
</script>
