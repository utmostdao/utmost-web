<template>
  <div class="network-card" @click="changeNetwork(network.id)">
    <el-image
      :src="imgLink(network.id)"
      alt="image"
      class="img"
      quality="30"
    ></el-image>
    <div class="content">
      {{ network.label === 'ETH' ? 'Ethereum' : network.label }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'NetworkCard',
  props: {
    network: {
      type: Object,
      required: true,
    },
  },
  methods: {
    changeNetwork(chainID: string) {
      this.$accessor.wallet.changeNetwork(chainID)
    },
    imgLink(chainID: string) {
      return this.$helpers.getNetworkLogo(chainID)
    },
  },
})
</script>

<style scoped lang="scss">
.network-card {
  width: 100%;
  @include flexR;
  align-items: center;
  .img {
    width: 24px;
    border-radius: 50%;
    height: 100%;
    margin-right: 4px;
  }
  .content {
    width: calc(100% - 28px);
    text-align: left;
    margin-right: auto;
  }
}
</style>
