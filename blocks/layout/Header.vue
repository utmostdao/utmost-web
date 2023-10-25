<template>
  <div class="layout-header">
    <LayoutTopBar />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LayoutHeader',
})
</script>

<style lang="scss" scoped>
.layout-header {
  width: 100%;
  height: 80px;
  background-color: $secondary;
  position: sticky;
  top: 0;
  z-index: 100;

  @include phone {
    height: 60px;
  }
}
</style>
