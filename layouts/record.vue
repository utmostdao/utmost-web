<template>
  <div class="nuxt">
    <LayoutHeader />
    <div class="nuxt-body">
      <Nuxt />
    </div>

    <confirm-dialog />
    <!-- <lazy-token-dialog /> -->
    <!-- <authorize-dialog /> -->
    <wallet-panel-dialog />
    <lazy-network-dialog />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'RecordLayout',
  watch: {
    $route() {
      window.scrollTo()
    },
  },
})
</script>
<style lang="scss" scoped>
.nuxt {
  height: max(100%, 830px);
  background: $background;
  .nuxt-body {
    width: 100%;
    height: 100%;

    @include phone {
      padding: 10px;
    }
  }
}
.dark-mode {
  .nuxt {
    background: linear-gradient(
      179.4deg,
      rgb(20, 20, 20) -16.9%,
      rgb(40, 40, 40) 119.9%
    );
  }
}
</style>
