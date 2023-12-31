<template>
  <basic-dialog name="wallet-panel-dialog" :fullscreen="true">
    <template #content="{}">
      <div class="wallet-panel">
        <div v-show="activeTab === 'custom'" class="connect-button-list">
          <div class="wallet-type-header">
            <div class="wallet-type">EVM</div>
            <div
              v-if="customEvmWallet"
              class="disconnect"
              @click="$accessor.wallet.disconnect"
            >
              {{ $t('disconnect') }}
            </div>
          </div>
          <wallet-card
            v-if="customEvmWallet"
            :connect-wallet="customEvmWallet"
            @click.native="$accessor.wallet.setActiveEvmWallet(customEvmWallet)"
          ></wallet-card>
          <template v-else>
            <div
              v-for="(item, index) in wallets()"
              :key="item.label"
              class="connect-button"
              @click="() => connectWallet(item)"
            >
              <div class="wallet-icon" v-html="icons[index]"></div>
              <span class="wallet-label">{{ item.label }}</span>
              <div class="loader">
                <spinner-loader
                  v-if="loading && label === item.label"
                  :size="20"
                ></spinner-loader>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
  </basic-dialog>
</template>

<script lang="ts">
import type { WalletModule } from '@web3-onboard/common'
import Vue from 'vue'
import { $vfm } from 'vue-final-modal-types'

export default Vue.extend({
  name: 'WalletPanelDialog',
  data() {
    return {
      activeTab: 'custom',
      error: '',
      loading: false,
      label: '',
      icons: [] as string[],
    }
  },
  computed: {
    customEvmWallet() {
      return this.$accessor.wallet.evmWallets[0]
    },
    activeEvmWallet() {
      return this.$accessor.wallet.activeEvmWallet
    },
    customEvmActive() {
      const label = this.$accessor.wallet.activeEvmWallet?.label
      return label
    },
  },
  mounted() {
    this.getIcons()
  },
  methods: {
    changeNetwork(chainID: string) {
      this.$accessor.wallet.changeNetwork(chainID)
      $vfm.hide('network-dialog')
    },
    selectTab(value: string) {
      this.activeTab = value
    },
    wallets() {
      const wallets = this.$onboard.state.get().walletModules
      return wallets
    },
    async getIcons() {
      const wallets = this.wallets()
      for (const wallet of wallets) {
        const icon = await wallet.getIcon()
        this.icons.push(icon)
      }
    },
    disconnectCustomEvmWallet(): void {
      this.$accessor.wallet.disconnect()
    },
    connectWallet(wallet: WalletModule) {
      try {
        this.loading = true
        this.label = wallet.label
        this.$accessor.wallet.connectWallet(wallet)
      } catch (err) {
        if (err instanceof Error) {
          this.error = err.message
        }
      } finally {
        this.loading = false
      }
    },
  },
})
</script>

<style scoped lang="scss">
.wallet-panel {
  @include flexC();
  align-items: center;
  min-height: 450px;
  margin-top: 20px;

  .top-tab-bar {
    width: 200px;
  }

  .connect-button-list {
    padding: 0px 17px 17px 17px;
    box-sizing: border-box;
    width: 100%;

    @include phone() {
      padding: 35px 0px 21px 0px;
    }

    .wallet-type-header {
      @include flexRsb;
      align-items: center;
      color: $textColor;

      .wallet-type {
        font-size: 16px;
        font-weight: 600;
        margin: 12px 0;
      }

      .disconnect {
        font-size: 12px;
        cursor: pointer;
      }
    }

    .connect-button {
      height: 60px;
      width: 100%;
      margin-bottom: 15px;
      border-radius: 4px;
      padding: 0 14px;
      background-color: $background;
      cursor: pointer;

      &:hover {
        background-color: $surface;
      }

      @include flexR();

      .wallet-icon {
        height: 40px;
        width: 40px;
        margin-right: 10px;
        @include flexRc();
      }

      .wallet-label {
        width: 100%;
        text-align: left;
        font-size: 14px;
        font-weight: 500;
        color: $textColorOp8;
      }

      .loader {
        height: 40px;
        width: 40px;
        @include flexRc();
      }
    }
  }
}
</style>
