<template>
  <div class="router-switcher">
    <nuxt-link
      v-for="menu in routerList"
      :key="menu.name"
      class="router"
      :class="{
        active: $helpers.equalRoute($route, menu.name),
      }"
      :to="localePath({ path: menu.path, query: $route.query })"
    >
      {{ menu.display }}
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'RouterSwitcher',
  computed: {
    routerList() {
      return [
        {
          name: 'index',
          path: '/',
          display: 'Swap',
        },
        {
          name: 'index-bridge',
          path: '/bridge',
          display: 'Bridge',
        },
      ]
    },
  },
})
</script>

<style scoped lang="scss">
.router-switcher {
  @include flexR;
  .router {
    margin-right: 30px;
    color: $textColorOp5;
    font-size: 16px;
    font-weight: 300;
    line-height: 20px;
    cursor: pointer;
    &.active {
      color: $textColor;
      font-weight: 500;
    }
  }
}
</style>
