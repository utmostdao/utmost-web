<template>
  <nuxt-child />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexPage',
  async asyncData({ $accessor }) {
    await $accessor.swap.initData()
  },
  data() {
    return {
      confirm: false,
    }
  },
  computed: {
    userAccount() {
      return this.$accessor.wallet.activeEvmWallet?.accounts[0]?.address
    },
  },
  watch: {
    userAccount: {
      deep: true,
      handler(val: string, old: string) {
        if (!val || val?.toLowerCase() !== old?.toLowerCase()) {
          if (this.getRouteBaseName() !== 'index') {
            this.$router.replace(
              this.localePath({ path: '/', query: this.$route.query })
            )
          }
          this.$accessor.swap.initData()
        }
      },
    },
  },
  destroyed() {
    this.$accessor.swap.removerTimer()
  },
  methods: {
    toConfirm() {
      this.confirm = true
    },
    toHome() {
      this.confirm = false
    },
  },
})
</script>

<style lang="scss" scoped></style>
