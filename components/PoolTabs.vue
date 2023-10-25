<template>
  <div class="path-bar">
    <nuxt-link
      v-for="(path, index) in tabs"
      :key="index"
      class="path-item"
      :class="{
        active: $helpers.equalRoute($route, path.name),
      }"
      :to="localePath({ path: path.path, query: $route.query })"
    >
      <div class="text">{{ path.display }}</div>
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'PathBar',
  data() {
    return {
      tabs: [
        {
          name: 'pool',
          path: '/pool',
          display: this.$t('pool.pool'),
        },
        {
          name: 'pool-joined',
          path: '/pool/joined',
          display: this.$t('pool.joined'),
        },
      ],
    }
  },
})
</script>

<style scoped lang="scss">
.path-bar {
  @include flexR;
  display: inline-flex;
  box-shadow: 0px 10px 25px 0px rgba(0, 0, 0, 0.05);
  border-radius: 4px !important;
  background-color: $textColor;
  overflow: hidden;
  .path-item {
    width: 120px;
    height: 40px;
    background: $secondary;
    color: $textColorOp5;
    &.active {
      background-color: $primary;
      color: $textColor;
    }
    .text {
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      line-height: 40px;
      line-height: 40px;
      cursor: pointer;
    }
  }
}
</style>
