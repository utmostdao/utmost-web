<template>
  <div v-if="isShowList" class="custom-tokens">
    <div class="title">{{ $t('customTokens') }}</div>
    <div class="content">
      <template v-for="(tokens, chainId) in customTokensObj">
        <div v-for="token in tokens" :key="token.swapTokenID" class="item">
          <div class="infos">
            <div class="left">
              <div class="token-box">
                <img
                  :src="
                    token.swapTokenID && token.swapTokenID.endsWith('custom')
                      ? token.swapTokenIcon
                      : $helpers.generateImgUrl(token.swapTokenIcon)
                  "
                  class="token-icon"
                />
                <img :src="chainIcon(chainId)" class="network-icon" />
              </div>

              <div class="info">
                <div class="symbol">
                  {{ token.swapThirdPartySymbol }}
                </div>
                <div class="more-infos">
                  <div class="name">{{ token.swapTokenName }}</div>
                  <div class="name address">
                    {{
                      $helpers.shortAddress(
                        token.swapTokenContractAddress || ''
                      )
                    }}
                    <span
                      @click.stop="onCopy(token.swapTokenContractAddress || '')"
                    >
                      <CopyIcon :size="12" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="right">
              <a class="delete" @click.stop="onDelete(chainId, token)">{{
                $t('delete')
              }}</a>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SwapTokens } from '~/types/swagger'

export default Vue.extend({
  name: 'CustomTokens',
  data() {
    return {
      customTokensObj: undefined as
        | { [key: string]: SwapTokens['items'] }
        | undefined,
    }
  },
  computed: {
    chainList() {
      return this.$accessor.swap.chainList
    },
    isShowList(): boolean {
      return (
        !!this.customTokensObj &&
        Object.values(this.customTokensObj).reduce(
          (list, tokens) => list.concat(tokens),
          []
        ).length > 0
      )
    },
  },
  mounted() {
    this.customTokensObj = this.$helpers.customTokens().getAll()
  },
  methods: {
    chainIcon(chainId: string | number) {
      return this.$helpers.generateImgUrl(
        this.chainList.find((item) => Number(item.chainID) === Number(chainId))
          ?.chainIcon
      )
    },
    onCopy(tx?: string) {
      if (!tx) return
      this.$helpers.copyText(tx)
    },
    onDelete(chainId: string | number, token: SwapTokens['items'][0]) {
      this.$helpers.customTokens(chainId.toString()).delete(token)
      this.customTokensObj = this.$helpers.customTokens().getAll()
    },
  },
})
</script>

<style scoped lang="scss">
.custom-tokens {
  width: 100%;

  .title {
    color: $textColor;
    font-family: Poppins;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;
  }

  .content {
    margin-top: 18px;

    .item {
      width: 100%;
      border-radius: $radius;
      overflow: hidden;
      position: relative;
      padding: 4px 16px;
      margin-bottom: 20px;
      cursor: pointer;
      @include flexCc;
      background-color: $background;

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
            justify-content: center;
            align-items: flex-start;

            .more-infos {
              margin-top: 2px;
              @include flexR;

              @include phone {
                justify-content: flex-start;
                flex-direction: column;
                align-items: flex-start;
              }
              .address {
                margin-left: 4px;
                margin-right: 2px;

                @include phone {
                  margin: 0;
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
          .delete {
            font-family: Poppins;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 130%;
          }
        }
      }
    }
  }
}
</style>
