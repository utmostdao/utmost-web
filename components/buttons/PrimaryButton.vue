<template>
  <el-button
    v-throttle:[0.5]
    type="primary"
    class="primary-button"
    :disabled="disabled || loading"
    :size="size"
    @click="$emit('click')"
  >
    <spinner-loader
      v-if="loading"
      :size="16"
      style="margin-right: 10px"
    ></spinner-loader>
    <slot class="button-text"></slot>
  </el-button>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import {} from 'element-ui/types/button'

export default Vue.extend({
  name: 'PrimaryBotton',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: undefined,
    } as PropOptions<'medium' | 'small' | 'mini'>,
  },
})
</script>

<style lang="scss" scoped>
::v-deep .el-button--primary:focus,
.el-button--primary:hover,
.el-button--primary.is-active,
.el-button--primary:active,
.el-button--primary:focus,
.el-button--primary:hover {
  color: $textColor;
  background-color: $primary;
  border-color: $primary;
}

.primary-button {
  background-color: $primary;
  border-color: $primary;
  font-size: 14px;
  border-radius: 10px !important;
  font-weight: bold;
  color: white !important;
  transition: 0.3s;

  ::v-deep span {
    @include flexRc;
  }
  &:hover,
  &:active,
  &:focus {
    opacity: 0.9;
    transition: 0.3s;
  }
  margin-left: 0 !important;
  &.is-disabled {
    background: lighten($primary, 10) !important;
    border-color: lighten($primary, 10) !important;
    opacity: 0.8;
  }
  ::v-deep svg {
    margin-left: 10px;
    path {
      fill: white;
    }
  }
}
</style>
