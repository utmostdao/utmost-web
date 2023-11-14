<template>
  <basic-dialog
    name="network-dialog"
    :fullscreen="true"
    :title="$t('selectChianAndToken')"
    :scroll="onScroll"
    @before-open="beforeOpen"
  >
    <template #header-extension>
      <div class="search-input" @keypress.enter="onSearch">
        <el-input
          v-model="searchToken"
          v-debounce:100="onSearch"
          :placeholder="$t('tokenSearchTip')"
          class="input"
        />
        <div class="search-icon" @click.stop="onSearch">
          <SearchIcon :size="18" />
        </div>
      </div>
    </template>
    <template #content="{}">
      <div class="network-dialog">
        <div class="network-content">
          <!-- chain list -->
          <div class="network-list">
            <template v-if="!loadingByChian">
              <template v-if="chainList.length > 0">
                <div
                  v-for="(chain, index) in chainList"
                  :key="index"
                  class="network-item"
                  :class="{
                    selected:
                      selectChain && chain.chainID === selectChain.chainID,
                  }"
                  @click="onSelectNetwork(chain)"
                >
                  <TokenImageCard
                    :src="$helpers.generateImgUrl(chain.chainIcon)"
                    :size="34"
                  />

                  <div class="network-name">{{ chain.netWorkName }}</div>
                </div>
              </template>
              <!-- <template v-else>
                <div class="no-data">{{ $t('noData') }}</div>
              </template> -->
            </template>
            <template v-else>
              <el-skeleton
                v-for="i in 5"
                :key="i"
                :animated="true"
                :count="1"
                class="network-item"
              >
                <template slot="template">
                  <el-skeleton-item
                    variant="rect"
                    style="width: 70px; height: 70px"
                  />
                </template>
              </el-skeleton>
            </template>
          </div>

          <!-- token list -->
          <div class="network-token-list">
            <template v-if="!loadingByToken || tokenList.length > 0">
              <template v-if="[...customTokens, ...tokenList].length > 0">
                <div
                  v-for="token in [...customTokens, ...tokenList]"
                  :key="token.swapTokenID"
                  class="token-item"
                  :class="{
                    disabled: token.swapTokenID
                      ? disabledTokenIds.includes(token.swapTokenID)
                      : false,
                    selected:
                      selectToken &&
                      selectToken.swapTokenID === token.swapTokenID,
                  }"
                  @click="onSelectToken(token)"
                >
                  <div class="infos">
                    <div class="left">
                      <div class="token-box">
                        <TokenImageCard
                          :size="36"
                          :src="
                            token.swapTokenID &&
                            token.swapTokenID.endsWith('custom')
                              ? token.swapTokenIcon
                              : $helpers.generateImgUrl(token.swapTokenIcon)
                          "
                        />
                        <TokenImageCard
                          v-if="selectChain"
                          :src="selectChain.chainIcon"
                          :size="18"
                          class="network-icon"
                        />
                      </div>

                      <div class="info">
                        <div class="symbol">
                          {{ token.swapThirdPartySymbol }}
                        </div>
                        <div class="more-infos">
                          <div class="name">{{ token.swapTokenName }}</div>
                        </div>

                        <div class="name address">
                          {{ $helpers.shortAddress(contractAddress(token)) }}
                          <span
                            v-if="contractAddress(token)"
                            @click.stop="onCopy(contractAddress(token))"
                          >
                            <CopyIcon :size="12" />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="right">
                      <PrimaryButton
                        v-if="isShowImportBtn(token)"
                        size="mini"
                        @click="onImport(token)"
                      >
                        {{ $t('import') }}
                      </PrimaryButton>
                      <div v-else class="balance">
                        <template
                          v-if="
                            token.swapTokenID &&
                            token.swapTokenID.endsWith('custom')
                          "
                        >
                          {{
                            tokenBalance && token.swapTokenContractAddress
                              ? $helpers.shortFloatNum(
                                  tokenBalance[token.swapTokenContractAddress],
                                  6
                                )
                              : '0'
                          }}
                        </template>
                        <template v-else>
                          {{ $helpers.shortFloatNum(token.balance || '0', 6) }}
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="loadingByToken" class="token-list-footer">
                  <SpinnerLoader v-if="loadingByToken" :size="18" />
                </div>
              </template>
              <template v-else>
                <el-empty :description="$t('noToken')"></el-empty>
              </template>
            </template>
            <template v-else-if="tokenList.length === 0">
              <el-skeleton
                v-for="i in 5"
                :key="i"
                :animated="true"
                :count="1"
                class="token-item-skeleton"
              >
                <template slot="template">
                  <el-skeleton-item
                    variant="rect"
                    style="width: 100%; height: 100%"
                  />
                </template>
              </el-skeleton>
            </template>
          </div>
        </div>
      </div>
    </template>
  </basic-dialog>
</template>

<script lang="ts">
import { ethers } from 'ethers'
import Vue from 'vue'
import { $vfm } from 'vue-final-modal-types'
import { SwapChainDetails, SwapTokens } from '~/types/swagger'
import { ORIGIN_TOKEN } from '~/utils/constants'

type ModelParams = {
  onSelect?: (chain, token) => void
  selectedChains?: SwapChainDetails
  selectedTokens?: SwapTokens['items']
  disabledTokens?: SwapTokens['items']
}

export default Vue.extend({
  name: 'NetworkDialog',
  data() {
    return {
      loadingByChian: false,
      loadingByToken: false,
      searchToken: undefined as undefined | string,
      queryTokenParams: {
        pageNo: 1,
        pageSize: 10,
        tokenType: '0',
      },
      modelParams: undefined as undefined | ModelParams,
      chainList: [] as SwapChainDetails,
      tokenList: [] as SwapTokens['items'],
      selectChain: undefined as undefined | SwapChainDetails[0],
      selectToken: undefined as undefined | SwapTokens['items'][0],
      importCount: 0, // 用于导入token信息后触发computed customToken更新，
      tokenBalance: undefined as { [key: string]: string } | undefined,
    }
  },
  computed: {
    selectedChains(): ModelParams['selectedChains'] {
      return this.modelParams?.selectedChains
    },
    selectedTokens(): ModelParams['selectedTokens'] {
      return this.modelParams?.selectedTokens
    },
    disabledChains(): ModelParams['disabledTokens'] {
      return this.modelParams?.disabledTokens
    },
    disabledTokenIds(): string[] {
      return (
        this.modelParams?.disabledTokens?.map(
          (item) => item.swapTokenID ?? ''
        ) ?? []
      )
    },
    customTokens(): SwapTokens['items'] {
      // 仅用于触发更新数据localeStorage数据，实际不做任何判断，importCount数据由onImport事件执行后更新
      if (this.importCount === undefined) return []

      if (!this.selectChain?.chainID) return []
      const tokens = this.$helpers.customTokens(this.selectChain.chainID).get()
      if (this.searchToken) {
        if (ethers.utils.isAddress(this.searchToken)) {
          const token = tokens.find(
            (item) => item.swapTokenContractAddress === this.searchToken
          )
          return token ? [token] : []
        } else {
          return tokens.filter((item) => {
            return (
              item.swapTokenName?.includes(this.searchToken!) ||
              item.swapThirdPartySymbol?.includes(this.searchToken!)
            )
          })
        }
      }

      return tokens
    },
  },
  watch: {
    customTokens: {
      deep: true,
      handler() {
        this.getTokenBalance()
      },
    },
  },
  methods: {
    beforeOpen(res) {
      this.modelParams = res.ref.params

      this.queryTokenParams.pageNo = 1
      this.tokenList = []
      this.loadingByToken = true
      this.searchToken = undefined
      this.selectChain = this.selectedChains?.[0]
      this.selectToken = this.selectedTokens?.[0]

      if (this.chainList.length === 0) {
        this.loadingByChian = true
        this.getChains()
      } else {
        this.selectChain =
          this.selectChain ??
          this.chainList.find((item) => {
            const chianId = this.$accessor.wallet.activeEvmWallet?.chainId
            if (!chianId) return false
            return Number(item.chainID) === Number(chianId)
          }) ??
          this.chainList[0]
        this.getTokens()
      }
    },
    isShowImportBtn(token: SwapTokens['items'][0]) {
      return (
        token.swapTokenID?.endsWith('custom') &&
        !this.customTokens.find(
          (item) =>
            item.swapTokenContractAddress === token.swapTokenContractAddress
        )
      )
    },
    onImport(token: SwapTokens['items'][0]) {
      if (this.selectChain?.chainID) {
        this.$helpers.customTokens(this.selectChain.chainID).set(token)
        this.tokenList = []
        this.importCount += 1
      }
    },
    async onScroll(pos: number) {
      if (pos < 100 && !this.loadingByToken) {
        this.queryTokenParams.pageNo += 1
        await this.getTokens()
      }
    },
    async getTokenBalance() {
      const tokens = this.customTokens
      const balanceMap = {}
      for (const item of tokens) {
        try {
          const balance = await this.$onboard.getBalance({
            chainId: Number(this.selectChain!.chainID!),
            contractAddress: item.swapTokenContractAddress!,
            userAddress:
              this.$accessor.wallet.activeEvmWallet!.accounts[0]!.address!,
            decimals: Number(item.swapTokenDecimals!),
          })
          balanceMap[item.swapTokenContractAddress!] = balance
        } catch (err) {
          balanceMap[item.swapTokenContractAddress!] = '0'
        }
      }

      this.tokenBalance = balanceMap
    },
    async generateCustomToken() {
      if (this.tokenList.length !== 0) return

      if (!this.searchToken) return
      if (ethers.utils.isAddress(this.searchToken)) {
        if (
          [...this.customTokens, ...this.tokenList].find(
            (item) => item.swapTokenContractAddress === this.searchToken?.trim()
          )
        ) {
          return
        }

        const customToken = {
          balance: '0',
          convertId: null,
          legalTenderExchangeRatio: { USD: '0' },
          swapThirdPartySymbol: '',
          swapTokenContractAddress: this.searchToken.trim(),
          swapTokenDecimals: 18,
          swapTokenID: Date.now().toString() + '.custom',
          swapTokenIcon: 'custom-token.png',
          swapTokenName: '',
          swapTokenNetwork: this.selectChain?.swapNetwork,
          swapTokenSymbol: '',
          tokenType: 0,
          usdExchange: '0',
        }

        try {
          const name = await this.$onboard.getTokenName({
            chainId: Number(this.selectChain?.chainID ?? '0'),
            contractAddress: customToken.swapTokenContractAddress,
          })

          const symbol = await this.$onboard.getTokenSymbol({
            chainId: Number(this.selectChain?.chainID ?? '0'),
            contractAddress: customToken.swapTokenContractAddress,
          })

          customToken.swapTokenSymbol = symbol
          customToken.swapThirdPartySymbol = symbol
          customToken.swapTokenName = name

          if (
            ![...this.customTokens, ...this.tokenList].find(
              (item) =>
                item.swapTokenContractAddress === this.searchToken?.trim()
            )
          ) {
            this.tokenList.push(customToken as any)
          }
        } catch (err) {
          throw new Error(this.$t('invalidErc20').toString())
        }
      }
    },
    async getChains() {
      try {
        this.loadingByChian = true
        const res = await this.$api.yapi.swapChainDetails({})
        this.chainList = (res ?? []).filter((item) => item.isActive)

        if (this.chainList.length > 0) {
          this.selectChain ||
            (this.selectChain =
              this.chainList.find((item) => {
                const chianId = this.$accessor.wallet.activeEvmWallet?.chainId
                if (!chianId) return false
                return Number(item.chainID) === Number(chianId)
              }) ?? this.chainList[0])
          this.getTokens()
        } else {
          this.loadingByToken = false
        }
      } catch (err) {
        this.loadingByToken = false
        if (err instanceof Error) {
          this.$message.error(err.message)
        }
      } finally {
        this.loadingByChian = false
      }
    },
    contractAddress(token: SwapTokens['items'][0]): string {
      if (token.swapTokenContractAddress?.toLowerCase() === ORIGIN_TOKEN) {
        return ''
      }
      return token.swapTokenContractAddress ?? ''
    },
    async getTokens() {
      const setTokens = (network: string, tokens: SwapTokens['items']) => {
        if (
          this.selectChain?.swapNetwork?.toLowerCase() !== network.toLowerCase()
        ) {
          return
        }

        // 避免不是当前网络的代币出现
        let _tokens = tokens.filter(
          (item) => item.swapTokenNetwork === this.selectChain?.swapNetwork
        )
        if (this.queryTokenParams.pageNo === 1) {
          this.tokenList = _tokens
        } else {
          // 过滤掉重复token,以及更新token
          _tokens = _tokens.filter((item) => {
            const _i = this.tokenList.findIndex(
              (t) => t.swapTokenID === item.swapTokenID
            )

            if (_i === -1) {
              return true
            } else {
              this.tokenList.splice(_i, 1, item)
              return false
            }
          })
          this.tokenList = [...this.tokenList, ..._tokens]
        }
      }

      try {
        // 获取本地缓存
        this.loadingByToken = true

        /// 搜索时不使用本地缓存
        const localeTokens = this.searchToken
          ? []
          : this.$helpers
              .tokenCaches(Number(this.selectChain?.chainID))
              .get(this.queryTokenParams.pageNo)

        // 避免切换网络时数据响应不及时导致页面数据错误
        if (this.queryTokenParams.pageNo === 1) {
          setTimeout(() => {
            setTokens(
              localeTokens?.[0]?.swapTokenNetwork ?? '',
              localeTokens ?? []
            )
          }, 200)
        } else {
          setTokens(
            localeTokens?.[0]?.swapTokenNetwork ?? '',
            localeTokens ?? []
          )
        }

        const res = await this.$api.yapi.swapTokens({
          ...this.queryTokenParams,
          network: this.selectChain?.swapNetwork ?? '',
          condition: this.searchToken && this.searchToken.trim(),
          userAddress:
            this.$accessor.wallet.activeEvmWallet?.accounts[0].address,
        })

        // 更新本地缓存数据
        this.$helpers
          .tokenCaches(Number(this.selectChain?.chainID))
          .set(res.items ?? [], this.queryTokenParams.pageNo)
        setTokens(res.items?.[0]?.swapTokenNetwork ?? '', res.items ?? [])

        await this.generateCustomToken()
      } catch (err) {
        if (err instanceof Error) {
          this.$message.error(err.message)
        }
      } finally {
        this.loadingByToken = false
      }
    },
    onCopy(tx?: string) {
      if (!tx) return
      this.$helpers.copyText(tx)
    },
    onSelectNetwork(chain: SwapChainDetails[0]) {
      this.selectChain = chain

      this.searchToken = undefined
      this.tokenList = []
      this.queryTokenParams.pageNo = 1
      this.getTokens()
    },
    onSelectToken(token: SwapTokens['items'][0]) {
      if (this.disabledTokenIds.includes(token.swapTokenID ?? '')) {
        return
      }
      this.selectToken = token
      this.modelParams?.onSelect?.(this.selectChain, this.selectToken)
      $vfm.hide('network-dialog')
    },
    onSearch() {
      // if (!this.searchToken) {
      //   return
      // }
      this.queryTokenParams.pageNo = 1
      this.tokenList = []
      this.getTokens()
    },
  },
})
</script>

<style scoped lang="scss">
::v-deep .el-input.is-disabled .el-input__inner {
  cursor: auto;
}

::v-deep .el-input__inner,
::v-deep .el-input.is-disabled .el-input__inner {
  height: 40px;
  border: none !important;
  background-color: transparent;
  padding: 0;
  font-size: 14px;
  font-weight: 400;
  color: $textColor;
}

.search-input {
  width: 100%;
  padding-right: 40px;
  margin-bottom: 30px;
  background-color: $secondary;
  z-index: 1;
  @include flexCc;
  position: relative;
  border: 1px solid $border;
  border-radius: $radius;
  background-color: $surface;

  .input {
    width: 100%;
    height: 42px;
    padding: 0 10px;
  }

  .search-icon {
    position: absolute;
    right: 15px;
    cursor: pointer;
    display: inline-flex;

    ::v-deep svg {
      circle,
      path {
        stroke: $textPrimary;
      }
    }
  }
}

.network-dialog {
  width: 100%;
  height: 560px;

  .no-data {
    color: $textColorOp5;
    font-size: 12px;
    font-weight: 500;
  }

  .network-content {
    width: 100%;
    @include flexRc;
    align-items: flex-start;
    justify-content: flex-start;
    position: relative;

    .network-list {
      width: 72px;
      .network-item {
        width: 70px;
        height: 70px;
        @include flexCc;
        border-radius: $radius;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        background-color: $secondary;
        margin-bottom: 4px;
        user-select: none;

        &::before {
          content: '';
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: -1;
        }

        &.selected {
          position: sticky;
          top: 0px;
          bottom: 0;
          z-index: 1;
          border-radius: $radius 0 0 $radius;

          &::before {
            background-color: $primary;
            opacity: 0.2;
          }

          &::after {
            content: '';
            width: 3px;
            height: 100%;
            position: absolute;
            right: 0;
            top: 0;
            background-color: $primary;
          }
        }

        .network-icon {
          width: 34px;
          height: 34px;
          background-color: $secondary;
          border-radius: 50%;
          overflow: hidden;
        }

        .network-name {
          color: $textColor;
          font-size: 12px;
          font-style: normal;
          font-weight: 500;
          line-height: 130%;
          margin-top: 3px;
        }
      }
    }

    .network-token-list {
      width: calc(100% - 72px - 12px);
      margin-left: 12px;
      @include flexCc;

      .token-item-skeleton {
        width: 100%;
        height: 70px;
        border-radius: $radius;
        margin-bottom: 20px;
        overflow: hidden;

        ::v-deep .el-skeleton {
          width: 100%;
          height: 100%;

          .el-skeleton__item {
            width: 100%;
            height: 100%;
          }
        }
      }

      .token-item {
        width: 100%;
        border-radius: $radius;
        overflow: hidden;
        position: relative;
        padding: 4px 16px;
        margin-bottom: 20px;
        cursor: pointer;
        @include flexCc;

        &.disabled {
          cursor: no-drop;
          opacity: 0.5;
        }

        &::before {
          content: '';
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          z-index: -1;
          background-color: $surface;
          opacity: 0.6;
          transition: 0.3s;
        }

        &:hover {
          &::before {
            opacity: 1;
            transition: 0.3s;
          }
        }

        &.selected {
          &::before {
            background-color: $primary;
            opacity: 0.2;
            transition: 0.3s;
          }
        }

        .infos {
          width: 100%;
          height: 70px;
          @include flexRsb;

          .left {
            width: 50%;
            height: 100%;
            @include flexRc;
            justify-content: flex-start;

            .token-box {
              width: 36px;
              height: 36px;
              position: relative;

              .token-icon {
                width: 36px;
                height: 36px;
                border-radius: 50%;
              }

              .network-icon {
                width: 18px;
                height: 18px;
                position: absolute;
                bottom: -4px;
                right: -4px;
                border-radius: 50%;
                background-color: $secondary;
                border: 1px solid #fff;
              }
            }

            .info {
              width: calc(100% - 36px);
              height: 100%;
              margin-left: 12px;
              @include flexC;
              justify-content: space-around;
              align-items: flex-start;

              .more-infos {
                margin-top: 2px;
                @include flexR;

                @include phone {
                  justify-content: flex-start;
                  flex-direction: column;
                  align-items: flex-start;
                }
              }

              .name {
                // width: 100%;
                color: $textColorOp5;
                font-size: 12px;
                font-style: normal;
                font-weight: 500;
                line-height: 130%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .address {
                margin-right: 2px;
                @include flexRc;

                span {
                  display: inline-flex;
                }

                @include phone {
                  margin: 0;
                }
              }

              .symbol {
                width: 100%;
                color: $textColor;
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 130%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }

          .right {
            .balance {
              color: $textColor;
              font-size: 14px;
              font-style: normal;
              font-weight: 500;
              line-height: 130%;
            }
          }
        }
      }

      .token-list-footer {
        height: 30px;
        width: 100%;
        @include flexCc;
      }
    }
  }
}
</style>
