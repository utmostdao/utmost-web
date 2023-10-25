<template>
  <div class="top-bar">
    <div class="title">{{ title }}</div>
    <div class="actions">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'TopBar',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
})
</script>

<style scoped lang="scss">
.top-bar {
  width: 100%;
  @include flexRsb;

  .title {
    color: $textColor;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 130%;
    user-select: none;

    @include phone {
      font-size: 14px;
    }
  }

  .actions {
    @include flexRc;

    .actions-item {
      width: 36px;
      height: 36px;
      border: 1px solid $border;
      border-radius: 50%;
      cursor: pointer;
      @include flexCc;
      margin-left: 14px;
      position: relative;
      transition: 0.4s;

      ::v-deep svg {
        stroke: $textPrimary;
        transition: 0.4s;

        path {
          stroke: $textPrimary;
          transition: 0.4s;
        }
      }

      &:hover {
        transform: scale(1.1);
        transition: 0.4s;

        ::v-deep svg {
          transform: scale(1.2);
          transition: 0.4s;

          @include phone {
            transform: none;
          }
        }

        @include phone {
          transform: none;
        }
      }
    }
  }
}
</style>
