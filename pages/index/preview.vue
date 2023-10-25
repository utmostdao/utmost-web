<template>
  <div class="swap-preview">
    <TopBar title="Swap Preview">
      <nuxt-link
        v-if="!loading"
        :to="localePath({ path: '/', query: $route.query })"
        class="actions-item"
      >
        <HomeIcon />
      </nuxt-link>
    </TopBar>
    <div class="content">
      <div style="width: 100%">
        <SwapPreviewFromTo />
        <div class="infos">
          <SwapPreview />
          <SwapRecipientAddress :is-preview="true" />
        </div>
      </div>
      <div v-if="!loading" class="timer">
        <TimeIcon :size="18" />
        <div class="time">{{ time }} s</div>
      </div>
      <SwapConfirm
        :type="'confirm'"
        @onConfirm="onConfirm"
        @onSuccess="onSuccess"
        @onError="onError"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'SwapPreviewPage',
  data() {
    return {
      timer: undefined as NodeJS.Timer | undefined,
      time: 30,
      loading: false,
    }
  },
  computed: {
    expiredAt() {
      return Number(this.$accessor.swap.swapPreviewInfos?.expiredAt ?? '0')
    },
  },
  mounted() {
    // const dateNow = Date.now()
    // const diff = (this.expiredAt - dateNow) / 1000
    // if (diff <= 0) {
    //   // await this.$accessor.swap.getSwapPreviewInfos()
    // }
    const routeQuery = this.$route.query

    if (!(routeQuery && routeQuery.from === 'approve')) {
      this.addTimer()
    }
  },
  destroyed() {
    this.removeTimer()
  },
  methods: {
    onConfirm() {
      this.loading = true
      this.removeTimer()
    },
    onSuccess() {
      this.loading = false
    },
    async onError() {
      await this.$accessor.swap.getSwapPreviewInfos()
      this.addTimer()
    },
    addTimer() {
      if (!this.timer) {
        this.timer = setInterval(() => {
          const dateNow = Date.now()
          const diff = (this.expiredAt - dateNow) / 1000
          this.time = Number(diff.toFixed())
          if (this.time <= 0) {
            this.removeTimer()
            this.$router.replace(
              this.localePath({ path: '/', query: this.$route.query })
            )
          }
        }, 1000)
      }
    },
    removeTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = undefined
        this.time = 30
      }
    },
  },
})
</script>

<style scoped lang="scss">
:v-deep svg {
  path {
    fill: $textColorOp8;
  }
}

.swap-preview {
  width: 100%;
  height: 100%;
  @include flexCc;
  align-items: flex-start;

  .content {
    width: 100%;
    height: 100%;
    margin-top: 20px;
    @include flexCsb;

    .infos {
      // margin-top: 20px;
      // background-color: $surface;
      border-radius: $radius;
      padding: 12px;
    }

    .timer {
      @include flexRc;
      .time {
        width: 40px;
        font-size: 12px;
        font-weight: 500;
        color: $textColorOp8;
        margin-left: 6px;
      }
    }
  }
}
</style>
