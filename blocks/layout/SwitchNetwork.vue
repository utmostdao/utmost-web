<template>
  <PopupMenu :options="options">
    <div class="switch-network">
      <el-image v-if="chainIcon" :src="chainIcon" class="icon"></el-image>
      <div v-else class="icon"></div>
    </div>

    <template #menu="{ item, hide }">
      <div
        class="chain-item"
        :class="{ active: Number(chainId) === Number(item.chainID) }"
        @click="
          () => {
            hide()
            changeNetwork(item.chainID)
          }
        "
      >
        <el-image :src="item.chainIcon" class="icon"></el-image>
        <div class="name">{{ item.netWorkName }}</div>
      </div>
    </template>
  </PopupMenu>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'SwitchNetwork',
  computed: {
    chainId(): string | undefined {
      return this.$accessor.wallet.chainId
    },
    chainIcon(): string {
      const chains = this.$accessor.swap.chainList
      return (
        chains.find(
          (item) => Number(item.chainID) === Number(this.chainId ?? '')
        )?.chainIcon ?? ''
      )
    },
    options() {
      return this.$accessor.swap.chainList.filter((item) => item.isActive)
    },
  },
  methods: {
    async changeNetwork(chianID: number | string) {
      try {
        const _chianID = `0x${Number(chianID).toString(16)}`
        const walletChain = this.$accessor.wallet.activeEvmWallet
        // 切换网络
        if (chianID !== walletChain?.chainId) {
          const result = await this.$accessor.wallet.changeNetwork(_chianID)
          if (result === false) {
            throw new Error(this.$i18n.t('changeNetworkErr').toString())
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          this.$message.error(err.message)
        }
      }
    },
  },
})
</script>

<style scoped lang="scss">
.switch-network {
  @include flexCc;
  .icon {
    height: 30px;
    width: 30px;
    margin-right: 6px;
    border-radius: 15px;
    transition: 0.3s;
  }
}

.icon {
  height: 30px;
  width: 30px;
  margin-right: 6px;
  border-radius: 15px;
  background-color: $surface;
}

.chain-item {
  padding: 6px 10px;
  @include flexRc;
  justify-content: flex-start;
  cursor: pointer;
  transition: 0.3s;
  margin: 4px 0;

  &:hover,
  &.active {
    background-color: $surface;
    transition: 0.3s;
  }
  // .icon {
  //   width: 30px;
  //   height: 30px;
  // }

  .name {
    font-size: 14px;
    font-weight: 500;
    color: $textColor;
    margin-left: 10px;
  }
}
</style>
