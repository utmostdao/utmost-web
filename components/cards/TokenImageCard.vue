<template>
  <el-image :style="style" :src="src" class="image-card">
    <template #error>
      <img style="width: 100%; height: 100%" src="/custom-token.png" />
    </template>
    <template #placeholder>
      <el-skeleton
        style="width: 100%; height: 100%"
        :animated="true"
        :count="1"
      >
        <template slot="template">
          <el-skeleton-item variant="image" style="width: 100%; height: 100%" />
        </template>
      </el-skeleton>
    </template>
  </el-image>
</template>

<script lang="ts">
import Vue from 'vue'
import { CSSProperties } from 'vue/types/jsx'
export default Vue.extend({
  name: 'TokenImageCard',
  props: {
    size: {
      type: Number,
      default: 40,
    },
    src: {
      type: String,
      default: '/custom-token.png',
    },
    radius: {
      type: String,
      default: '50%',
    },
  },
  computed: {
    style(): CSSProperties {
      return {
        width: this.size + 'px',
        height: this.size + 'px',
        borderRadius: this.radius,
      }
    },
  },
})
</script>

<style scoped lang="scss">
::v-deep .el-skeleton {
  width: 100%;
  height: 100%;
}
.image-card {
  overflow: hidden;
  position: relative;
}
</style>
