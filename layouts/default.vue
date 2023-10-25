<template>
  <div class="nuxt">
    <LayoutHeader />
    <div class="nuxt-body">
      <div class="page-card">
        <Nuxt />
      </div>
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
  name: 'DefaultLayout',
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
    .page-card {
      width: 450px;
      height: auto;
      min-height: 500px;
      background-color: $secondary;
      padding: 24px;
      border-radius: $radius;
      margin: 0 auto;
      margin-top: 40px;
      position: relative;

      @include phone {
        width: 100%;
        margin-top: 0;
        padding: 12px;
      }
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
