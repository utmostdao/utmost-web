<template>
  <div class="register-form">
    <div class="content">
      <TopBar :title="$t('registerTitle')">
        <nuxt-link
          :to="localePath({ path: '/', query: $route.query })"
          class="actions-item"
        >
          <HomeIcon />
        </nuxt-link>
      </TopBar>

      <div class="form-body">
        <div class="form-item">
          <div class="label">{{ $t('registerItem1Label') }}</div>
          <el-input
            v-model="form.id"
            class="input"
            placeholder="Please input"
            @input="onInput"
          />
        </div>
        <div class="form-item">
          <div class="label">
            <span>{{ $t('registerItem2Label') }}</span>
            <div class="actions">
              <el-switch v-model="useExtend" />
            </div>
          </div>
          <el-input
            v-if="useExtend"
            v-model="form.extend"
            class="input"
            placeholder="Please input"
          />
        </div>
      </div>
    </div>

    <div class="error">
      {{ errStr }}
    </div>

    <PrimaryButton
      class="confirm-btn"
      :disabled="confirmDisabled"
      :loading="loading"
      @click="onSubmit"
    >
      <template> {{ $t('registerNow') }} </template>
    </PrimaryButton>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'RecordRegisterForm',
  data() {
    return {
      form: {
        id: '',
        extend: '',
      },
      useExtend: true,
      loading: false,
      errStr: '',
    }
  },
  computed: {
    confirmDisabled(): boolean {
      return !this.form.id
    },
  },
  methods: {
    onInput(val) {
      if (!val) {
        this.errStr = this.$t('emptyLabel').toString()
      } else {
        this.errStr = ''
      }
    },
    async onSubmit() {
      if (!this.form.id) {
        this.errStr = this.$t('emptyLabel').toString()
        return
      }
      try {
        this.loading = true
        const referralCode = (this.$route.query.r ?? undefined) as
          | string
          | undefined
        await this.$accessor.wallet.registerReferral({
          ...this.form,
          referralCode,
        })
        this.$emit('onFinish')
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
.register-form {
  width: 100%;
  min-height: 500px;
  @include flexCsb;

  .content {
    width: 100%;
    .form-body {
      width: 100%;
      min-height: 100%;
      margin-top: 40px;

      .form-item {
        width: 100%;
        margin-bottom: 20px;

        .label {
          width: 100%;
          @include flexRsb;
          margin-bottom: 12px;
          font-size: 14px;
          font-weight: 500;
          color: $textColor;
        }
      }
    }
  }

  .error {
    font-size: 12px;
    font-weight: 500;
    color: $error;
  }

  .confirm-btn {
    width: 100%;
    // position: absolute;
    // bottom: 0;
  }
}
</style>
