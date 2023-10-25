<template>
  <VMenu theme="dapp-menu" :positioning-disabled="$breakpoints.sMd">
    <div @click.stop>
      <slot />
    </div>
    <template #popper="{ hide }">
      <div class="popup-menu">
        <div v-if="$breakpoints.sMd" class="top-bar">
          <div class="title">{{ title }}</div>
          <div class="title-content">{{ titleContent }}</div>
          <div class="close" @click="hide">
            <icon-wrapper><close-icon :size="24"></close-icon></icon-wrapper>
          </div>
        </div>
        <div v-for="(item, index) in options" :key="index" class="menu-item">
          <slot name="menu" :item="item" :hide="hide" />
        </div>
        <slot name="footer" :hide="hide" />
      </div>
    </template>
  </VMenu>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
  name: 'PopupMenu',
  props: {
    title: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => {
        return []
      },
    } as PropOptions<any[]>,
    titleContent: {
      type: String,
      default: '',
    },
  },
})
</script>

<style lang="scss" scoped>
::v-deep .popup-menu {
  @include flexCc();
  background-color: red;
}
.popup-menu {
  .top-bar {
    height: 100%;
    margin-bottom: 22px;

    @include phone {
      margin: 10px 0;
      height: 40px;
    }
    .title {
      height: 21px;
      font-size: 15px !important;
      font-weight: 500 !important;
      color: $textColor !important;
      line-height: 21px !important;
    }
    .title-content {
      color: black;
      margin-top: 14px;
      font-size: 15px;
    }
  }
  .menu-item {
    width: 100%;
  }
}
.menu-button {
  max-width: 315px;
}
</style>
