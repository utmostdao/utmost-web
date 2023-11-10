<template>
  <basic-dialog
    name="swap-settings-dialog"
    :fullscreen="true"
    :title="$t('txConfig')"
    @before-open="beforeOpen"
    @closed="closed"
  >
    <template #content="{}">
      <div v-if="isOpen" class="settings-content">
        <SwapSlippageSetting />
        <SwapCustomTokens />
      </div>
    </template>
  </basic-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'SwapSettingsDialog',
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    beforeOpen() {
      this.isOpen = true
    },
    closed() {
      this.isOpen = false
    },
  },
})
</script>

<style scoped lang="scss">
.settings-content {
  width: 100%;
  min-height: 400px;
}
</style>
