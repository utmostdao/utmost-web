<template>
  <div class="tab-bar" :style="tabStyle">
    <div
      v-for="tab in tabs"
      :key="tab.key"
      class="tab"
      :class="{ selected: tab.key === activeTab }"
      @click="$emit('select', tab.key)"
    >
      {{ tab.name }}
    </div>
    <div class="indicator" :style="indicatorStyle"></div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

interface TabType {
  key: string
  name: string
}

export default Vue.extend({
  name: 'TabBar',
  props: {
    tabs: {
      type: Array,
      required: true,
    } as PropOptions<TabType[]>,
    activeTab: {
      type: String,
      default: '',
    },
  },
  computed: {
    active(): string {
      return this.activeTab
    },
    tabStyle(): { gridTemplateColumns: string } {
      return {
        gridTemplateColumns: `repeat(${this.tabs.length}, 1fr)`,
      }
    },

    indicatorStyle(): { left: string; width: string } {
      const index = this.tabs.map((t) => t.key).indexOf(this.active)
      const width = 100 / this.tabs.length + '%'
      const left = (100 / this.tabs.length) * index + '%'
      return {
        left,
        width,
      }
    },
  },
})
</script>

<style lang="scss" scoped>
@use 'sass:color';
.tab-bar {
  position: relative;
  height: 40px;
  display: grid;
  .tab {
    cursor: pointer;
    padding: 4px 10px;
    width: 100%;
    color: $textColorOp8;
    z-index: 5;
    @include flexCc;
    &.selected {
      color: $textColor;
      transition: color 0.3s ease-out;
    }
  }
  .indicator {
    position: absolute;
    height: 32px;
    margin: 4px 0px;
    border-radius: 8px;
    width: 50%;
    left: 0%;
    background: $primary;
    transition: all 0.3s ease-out;
  }
}
</style>
