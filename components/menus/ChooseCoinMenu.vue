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
            <icon-wrapper><close-icon></close-icon></icon-wrapper>
          </div>
        </div>
        <div class="menu">
          <div v-for="(item, index) in options" :key="index" class="menu-item">
            <slot name="menu" :item="item" :hide="hide" />
          </div>
        </div>
        <slot name="footer" :hide="hide" />
      </div>
    </template>
  </VMenu>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
  name: 'ChooseCoinMenu',
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
  .menu {
    width: 100%;
    padding: 24px 30px;
    .menu-item {
      width: 100%;
      margin-bottom: 26px;
      color: $textColorOp8;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
    }
  }
}
.menu-button {
  max-width: 315px;
}
</style>
