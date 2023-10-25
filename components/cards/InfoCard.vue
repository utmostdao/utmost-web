<template>
  <div class="info-card">
    <div class="title">{{ title }}</div>
    <div class="content">{{ content }}</div>
    <div class="icon">
      <slot name="icon" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'InfoCard',
  props: {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
  },
})
</script>

<style scoped lang="scss">
.info-card {
  @include flexR;
  width: 100%;
  font-size: 12px;
  height: 17px;
  line-height: 12px;
  .title {
    width: 80px;
    text-align: left;
    white-space: nowrap;
    color: #bfbfbf;
  }
  .content {
    margin-left: auto;
    width: calc(100% - 98px);
    text-align: right;
    white-space: nowrap;
    color: #8c8c8c;
  }
  .icon {
    transform: rotate(270deg);
  }
}
</style>
