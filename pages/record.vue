<template>
  <div class="record-page">
    <div v-if="isMobile && isRegister" class="invite-card">
      <RecordInviteCard />
    </div>
    <div class="page-card" :class="{ 'loading-card': loading }">
      <div v-if="loading" class="loading">
        <SpinnerLoader />
        <div class="loading-tip">{{ loadingTip }}</div>
      </div>

      <template v-else>
        <template v-if="isRegister">
          <RecordInfos />
        </template>
        <RecordRegisterForm v-else @onFinish="onFinish" />
      </template>
    </div>

    <div v-if="!isMobile && isRegister" class="right-panel">
      <div class="invite-card">
        <RecordInviteCard />
      </div>
    </div>
    <el-popover trigger="click">
      <template #reference>
        <div class="referral-rule">
          <HelpIcon />
        </div>
      </template>
      <RecordReferralRule />
    </el-popover>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SwapSummary } from '~/types/swagger'
export default Vue.extend({
  name: 'RecordPage',
  layout: 'record',
  async asyncData({ $accessor }) {
    const address = $accessor.wallet.activeEvmWallet?.accounts[0].address
    if (!address) return {}
    await $accessor.swap.getSwapSummary()
  },
  data() {
    return {
      loading: false,
      loadingTip: undefined as string | undefined,
    }
  },
  computed: {
    swapSummary(): SwapSummary {
      return this.$accessor.swap.swapSummary
    },
    isMobile(): boolean {
      return this.$breakpoints.sMd
    },
    isRegister(): boolean {
      const referralCode = this.swapSummary?.referralCode
      return Boolean(referralCode && referralCode !== '0')
    },
    userAddress(): string | undefined {
      return this.$accessor.wallet.activeEvmWallet?.accounts[0].address
      // return '0x4ECC3c067f3c960FA455374B0188244EF9Dc0B0e'
    },
  },
  watch: {
    userAddress: {
      deep: true,
      handler() {
        this.getReferralInfo()
      },
    },
  },
  mounted() {
    this.changeNetwork()
  },
  methods: {
    async getReferralInfo() {
      // 钱包断开连接后返回首页
      if (!this.userAddress) {
        this.$router.replace(
          await this.localePath({ path: '/', query: this.$route.query })
        )
        return
      }
      try {
        this.loading = true
        this.loadingTip = this.$t('loading').toString()
        this.$accessor.swap.setSwapSummary(undefined)
        this.changeNetwork()

        await this.$accessor.swap.getSwapSummary()
      } catch (err) {
        if (err instanceof Error) {
          this.$message.error(err.message)
        }
        await this.localePath({ path: '/', query: this.$route.query })
      } finally {
        this.loading = false
      }
    },
    async getData() {
      try {
        this.loading = true
        const address = this.userAddress
        if (!address) throw new Error('Please connect wallet!')
        this.loadingTip = this.$t('waitingTip').toString()
        await new Promise((resolve, reject) => {
          const createDate = Date.now()
          const timeout = () => {
            setTimeout(() => {
              getData()
            }, 3000)
          }
          const getData = () => {
            this.$accessor.swap.getSwapSummary().then(() => {
              if (this.isRegister) {
                resolve('')
              } else {
                if (Date.now() - createDate > 5 * 60 * 1000) {
                  reject(Error('time-out'))
                  return
                }
                timeout()
              }
            })
          }
          getData()
        })
      } catch (err) {
        if (err instanceof Error) {
          this.$message.error(err.message)
        }
        this.$router.replace(
          this.localePath({ path: '/', query: this.$route.query })
        )
      } finally {
        this.loading = false
        this.loadingTip = ''
      }
    },
    onFinish() {
      this.getData()
    },
    async changeNetwork() {
      try {
        this.loading = true
        if (!this.isRegister) {
          this.loadingTip = this.$t('switchNetwork').toString()
          await this.$accessor.wallet.changeNetwork(
            `0x${Number(137).toString(16)}`
          )
        }
      } catch (err) {
        if (err instanceof Error) {
          this.$message.error(err.message)
        }
        await this.$router.replace(
          this.localePath({ path: '/', query: this.$route.query })
        )
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
<style lang="scss">
.el-popper {
  @include phone {
    width: calc(100% - 10px) !important;
    margin: 0 0 0 10px !important;
  }
}
</style>

<style scoped lang="scss">
.record-page {
  width: 100%;
  min-height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 40px;
  @include phone {
    padding-top: 0;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .page-card {
    width: 450px;
    height: auto;
    // min-height: 500px;
    background-color: $secondary;
    padding: 24px;
    border-radius: $radius;
    position: relative;
    margin: 0 20px;

    @include phone {
      margin: 0;
    }

    &.loading-card {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      margin: 0;
    }

    @include phone {
      width: 100%;
      margin-top: 0;
      padding: 12px;
    }

    .loading {
      .loading-tip {
        color: $textColorOp8;
        font-size: 12px;
        font-weight: 500;
        margin-top: 10px;
      }
    }
  }

  .right-panel {
    position: sticky;
    top: 120px;
  }

  .invite-card {
    @include phone {
      width: 100%;
      margin-bottom: 10px;
    }
  }

  .referral-rule {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
    background-color: rgba(0, 0, 0, 0.04);
    position: fixed;
    bottom: 45px;
    right: 45px;
    border-radius: 50%;
    @include flexCc;
    cursor: pointer;

    @include phone {
      width: 40px;
      height: 40px;
      bottom: 20px;
      right: 20px;
    }
  }
}
</style>
