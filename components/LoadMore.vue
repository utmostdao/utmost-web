<template>
  <div class="load-more">
    <div v-if="loading" class="loading">
      <spinner-loader :size="spinnerSize"></spinner-loader>
    </div>
    <div v-else-if="noMore" class="status">{{ $t('noMore') }}</div>
    <div v-else-if="loadMore" class="load-more" @click="$emit('loadMore')">
      {{ $t('loadMore') }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LoadMore',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    noMore: {
      type: Boolean,
      default: false,
    },
    loadMore: {
      type: Boolean,
      default: false,
    },
    noDataTip: {
      type: String,
      default() {
        return this.$t('listFooter.noData')
      },
    },
    compact: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    spinnerSize() {
      return this.compact ? 20 : 30
    },
  },
})
</script>

<style scoped lang="scss">
.status {
  font-size: 12px;
  font-weight: 500;
  color: $textColorOp5;
}
.load-more {
  margin-top: 10px;
  color: $primary;
  font-size: 12px;
  font-weight: 500;
}
</style>
