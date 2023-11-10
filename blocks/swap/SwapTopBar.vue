<template>
  <div class="top-bar">
    <TopBar title="Alpha">
      <div class="actions">
        <template v-if="userAddress">
          <div class="actions-item refresh" @click="onRefresh">
            <RefreshIcon
              class="icon"
              :size="20"
              :class="{ loading: refreshInfo.loading }"
            />

            <div
              v-if="!refreshInfo.loading && !!refreshInfo.timer"
              class="time"
            >
              {{ refreshInfo.time }}
            </div>
          </div>
          <div class="actions-item" @click.stop="openSettings">
            <SettingIcon :size="20" />
          </div>
          <nuxt-link
            :to="localePath({ path: '/record', query: $route.query })"
            class="actions-item"
          >
            <ReferralIcon :size="20" />
          </nuxt-link>
          <nuxt-link
            :to="localePath({ path: '/history', query: $route.query })"
            class="actions-item"
          >
            <HistoryIcon :size="20" />
          </nuxt-link>
        </template>
      </div>
    </TopBar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { $vfm } from 'vue-final-modal-types'
export default Vue.extend({
  name: 'SwapTopBar',
  computed: {
    refreshInfo() {
      return this.$accessor.swap.refreshInfo
    },
    userAddress(): string | undefined {
      return this.$accessor.wallet.activeEvmWallet?.accounts?.[0]?.address
    },
  },
  methods: {
    onRefresh() {
      this.$accessor.swap.refreshData()
    },
    openSettings() {
      $vfm.show('swap-settings-dialog')
    },
  },
})
</script>

<style scoped lang="scss">
.top-bar {
  .actions {
    @include flexRc;
    .actions-item {
      width: 36px;
      height: 36px;
      border: 1px solid $border;
      border-radius: 50%;
      cursor: pointer;
      @include flexCc;
      margin-left: 14px;
      position: relative;
      transition: 0.4s;

      ::v-deep svg {
        stroke: $textPrimary;
        transition: 0.4s;

        path {
          stroke: $textPrimary;
          transition: 0.4s;
        }
      }

      &:hover {
        transform: scale(1.1);
        transition: 0.4s;

        ::v-deep svg {
          transform: scale(1.2);
          transition: 0.4s;

          @include phone {
            transform: none;
          }
        }

        @include phone {
          transform: none;
        }
      }
      &.refresh {
        .icon {
          cursor: pointer;
          // animation: spinning2 0.8s linear;
          display: flex;

          &.loading {
            animation: spinning 0.8s linear infinite;
          }
          @keyframes spinning {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes spinning2 {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        }
      }

      .time {
        position: absolute;
        font-size: 12px;
        color: $textPrimary;
        transform: scale(0.8);
        transition: 0.4s;
      }

      ::v-deep svg {
        stroke: $textPrimary;
        transition: 0.4s;

        path {
          stroke: $textPrimary;
          transition: 0.4s;
        }
      }

      &:hover {
        transform: scale(1.1);
        transition: 0.4s;

        @include phone {
          transform: none;
        }

        ::v-deep svg {
          transform: scale(1.2);
          transition: 0.4s;

          @include phone {
            transform: none;
          }
        }

        .time {
          transform: scale(1);
          transition: 0.4s;
          @include phone {
            transform: none;
          }
        }
      }
    }
  }
}
</style>
