<template>
  <el-input
    v-model="inputValue"
    :placeholder="placeholder"
    :disabled="disabled"
    @blur="inputValue = $event.target.value.trim()"
  ></el-input>
</template>

<script>
export default {
  name: 'InputItem',
  props: {
    placeholder: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    inputValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('update:value', value)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item__label {
  height: 20px;
  line-height: 20px;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
  color: $textColorOp8;
  margin-bottom: 10px;
}
::v-deep .el-input__inner {
  width: 100%;
  height: 40px;
  border-radius: 4px;
  border: 1px solid $border;
  background: $secondary;
  color: $textColor;
  &:active,
  &.focus,
  &.focus {
    border-color: $primary !important;
  }
}
</style>
