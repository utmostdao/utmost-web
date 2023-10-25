<template>
  <div class="swap-confirm">
    <PrimaryButton
      :loading="loading"
      class="confirm-btn"
      :disabled="btnDisabled"
      @click="onSubmit"
    >
      <!-- <template v-if="errStr">
        <span class="error-tip">{{ errStr }}</span>
      </template> -->
      <template>
        {{ txLoading ? $t('txWaitTip') : btnLabel }}
      </template>
    </PrimaryButton>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
  name: 'SwapConfirm',
  props: {
    type: {
      type: String,
      default: 'preview',
    } as PropOptions<'preview' | 'confirm' | 'approve' | 'results'>,
    maxAllowance: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      txLoading: false,
    }
  },
  computed: {
    btnLabel(): string {
      switch (this.type) {
        case 'confirm':
          return this.$t('confirm').toString()
        case 'approve':
          return this.$t('authorizeDialog.authorize').toString()
        case 'results':
          return this.$t('homePage').toString()
        default:
          return this.$t('preview').toString()
      }
    },
    btnDisabled(): boolean {
      const { swapPreviewInfos, errStr, refreshInfo } = this.$accessor.swap
      if (this.type === 'results') {
        return false
      }
      return !swapPreviewInfos || !!errStr || refreshInfo.loading
    },
  },
  async mounted() {
    const routeQuery = this.$route.query
    if (routeQuery && routeQuery.from === 'approve') {
      await this.$accessor.swap.getSwapPreviewInfos()
      this.onConfirm(true)
      this.$router.replace({
        query: this.$route.query.r ? { r: this.$route.query.r } : undefined,
      })
    }
  },
  methods: {
    onSubmit() {
      switch (this.type) {
        case 'preview':
          this.onPreview()
          break
        case 'approve':
          // this.onConfirm()
          this.onApprove()
          break
        case 'confirm':
          this.onConfirm()
          break
        case 'results':
          this.$router.replace(
            this.localePath({ path: '/', query: this.$route.query })
          )
          this.$accessor.swap.initData()
          break
      }
    },
    async onPreview() {
      try {
        this.loading = true
        this.$accessor.swap.removerTimer()
        await this.$accessor.swap.getSwapPreviewInfos({ useLoading: false })

        this.$router.push(
          this.localePath({ path: '/preview', query: this.$route.query })
        )
      } catch (err) {
        if (err instanceof Error) {
          this.$message.error(err.message)
        }
      } finally {
        this.loading = false
      }
    },
    async onConfirm(a?: boolean) {
      const { isOriginToken } = this.$accessor.swap
      const dateNow = Date.now()
      const expiredAt = Number(
        this.$accessor.swap.swapPreviewInfos?.expiredAt ?? '0'
      )
      const diff = (expiredAt - dateNow) / 1000
      if (diff <= 2) {
        this.$message.error(this.$t('previewInfoExpired').toString())
        this.$router.replace(
          this.localePath({ path: '/', query: this.$route.query })
        )

        return
      }
      try {
        this.loading = true
        if (!isOriginToken && !a) {
          const isApprove = await this.$accessor.swap.checkTokenIsNeedApprove()

          if (!isApprove) {
            this.$router.replace(
              this.localePath({ path: '/approve', query: this.$route.query })
            )
            return
          }
        }

        this.txLoading = true
        this.$emit('onConfirm')
        await this.$accessor.swap.confirmSwapInfo()
        await this.$accessor.swap.sendTransaction()

        this.$router.replace(
          this.localePath({ path: '/results', query: this.$route.query })
        )
      } catch (err) {
        this.$emit('onError')
        if (err instanceof Error) {
          const errs = err.message?.split?.('(')
          this.$message.error(errs?.[0] ?? err.message)
        }
      } finally {
        this.loading = false
        this.txLoading = false
        this.$emit('onSuccess')
      }
    },
    async onApprove() {
      try {
        this.loading = true
        await this.$accessor.swap.approveToken({
          maxAllowance: this.maxAllowance,
        })

        this.$router.replace(
          this.localePath({
            path: '/preview',
            query: { ...(this.$route.query ?? {}), from: 'approve' },
          })
        )
      } catch (err) {
        if (err instanceof Error) {
          const errs = err.message?.split?.('(')
          this.$message.error(errs?.[0] ?? err.message)
        }
      } finally {
        this.loading = false
      }
    },
  },
})
</script>

<style scoped lang="scss">
.swap-confirm {
  width: 100%;
  margin-top: 40px;

  .confirm-btn {
    width: 100%;
  }

  .error-tip {
    // color: $error;
  }
}
</style>
