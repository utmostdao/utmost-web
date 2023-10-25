<template>
  <basic-dialog name="confirm-dialog" title="Warning" @before-close="cancel">
    <template #content="{ close, params }">
      <div class="description">
        <div class="text">{{ params.content }}</div>
      </div>
      <div class="buttons">
        <plain-button
          class="button"
          @click="
            () => {
              cancel()
              close()
            }
          "
          >{{ cancelButtonText(params) }}</plain-button
        >
        <primary-button
          :loading="loading"
          class="button"
          @click="
            () => {
              confirm(close, params)
            }
          "
          >{{ confirmButtonText(params) }}</primary-button
        >
      </div>
    </template>
  </basic-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { $vfm } from 'vue-final-modal-types'
import { ConfirmMessage } from '~/types/common'

export default Vue.extend({
  name: 'ConfirmDialog',
  data: () => ({
    show: false,
    loading: false,
  }),
  methods: {
    setLoading(value: boolean) {
      this.loading = value

      if (!value) {
        $vfm.hide('confirm-dialog')
      }
    },
    confirm(close: () => void, params: ConfirmMessage): void {
      this.$confirmDialog.option.resolver?.({
        loading: this.setLoading,
      })

      if (!params.useLoading) {
        close()
      }
    },
    cancel(): void {
      this.loading = false
      this.$confirmDialog.option.rejecter?.()
    },
    confirmButtonText(params: ConfirmMessage) {
      return params.confirmButtonText ?? this.$t('confirm')
    },
    cancelButtonText(params: ConfirmMessage) {
      return params.cancelButtonText ?? this.$t('cancel')
    },
  },
})
</script>
<style lang="scss" scoped>
.description {
  margin: 20px;
  @include flexCc();
  .text {
    font-size: 14px;
    font-weight: 400;
    color: $textColor;
    line-height: 18px;
  }
}
.buttons {
  width: 100%;
  padding: 15px 20px 24px 20px;
  @include flexRsb();
  .button {
    width: 120px;
    height: 40px;
    @include phone {
      width: 120px;
    }
  }
}
</style>
