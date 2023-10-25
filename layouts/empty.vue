<template>
  <div class="nuxt">
    <Nuxt />
    <confirm-dialog></confirm-dialog>
    <connect-wallet-dialog />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'EmptyLayout',
  watch: {
    $route() {
      window.scrollTo()
    },
  },
})
</script>
<style lang="scss" scoped>
.nuxt {
  height: 100%;
  min-height: 100%;
}
</style>
