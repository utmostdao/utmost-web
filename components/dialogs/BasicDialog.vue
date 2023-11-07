<template>
  <client-only>
    <vue-final-modal
      ref="dialog"
      v-slot="{ close, params }"
      v-model="show"
      :ssr="true"
      attach="body"
      :name="name"
      :classes="['dialog-container', { fullscreen }]"
      overlay-class="dialog-overlay"
      :content-class="['dialog-content', { fullscreen }]"
      :click-to-close="false"
      :lock-scroll="false"
      v-on="$listeners"
    >
      <div class="container" :class="{ 'fullscreen-container': fullscreen }">
        <div v-if="title" class="header">
          <div class="title">{{ getTitle(params) }}</div>
          <div
            class="icon"
            @click.stop="
              () => {
                close()
              }
            "
          >
            <icon-wrapper
              ><close-icon class="close-icon"></close-icon
            ></icon-wrapper>
          </div>
          <slot name="header-extension" :close="close" :params="params" />
        </div>
        <overlay-scrollbars
          :options="{
            scrollbars: { autoHide: 'scroll' },
            callbacks: {
              onScroll: onScroll,
              onContentSizeChanged: onContentSizeChanged,
            },
          }"
          style="width: 100%; height: 100%"
          class="overlay-scrollbars"
        >
          <div class="content">
            <slot name="content" :close="close" :params="params"></slot>
          </div>
          <div
            v-if="!title"
            class="icon"
            @click.stop="
              () => {
                close()
              }
            "
          >
            <icon-wrapper
              ><close-icon class="close-icon"></close-icon
            ></icon-wrapper>
          </div>
        </overlay-scrollbars>

        <!-- <div class="footer">
          <slot name="footer" :close="close" :params="params"></slot>
        </div> -->
      </div>
    </vue-final-modal>
  </client-only>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'BasicDialog',
  props: {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    beforeClose: {
      type: Function,
      default: () => {},
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    scroll: {
      type: Function,
      default: () => {
        return () => {}
      },
    },
  },
  data() {
    return {
      show: false,
      scrollSize: { width: 0, height: 0 },
    }
  },
  methods: {
    getTitle(params: any) {
      return params.title ?? this.title
    },
    onContentSizeChanged(data) {
      this.scrollSize = data
    },
    onScroll(data) {
      const scrollTop = data.target.scrollTop
      const clientHeight = data.target.clientHeight
      const offsetH = this.scrollSize.height - clientHeight
      this.scroll(offsetH - scrollTop)
    },
  },
})
</script>

<style lang="scss" scoped>
::v-deep .dialog-overlay {
  position: fixed !important;
}
::v-deep .dialog-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed !important;

  @include phone {
    &.fullscreen {
      justify-content: flex-end;
    }
    .fullscreen {
      width: 100%;
    }
  }
}
</style>

<style lang="scss" scoped>
.dialog-content {
  overflow: auto;
  position: relative;

  .container {
    width: 450px;
    background-color: $secondary;
    border-radius: $dialogRadius;
    padding-bottom: 20px;
    position: relative;
    @include flexC();
    @include phone {
      width: min(372px, calc(100vw - 42px));
      margin: 0;
      @include flexC();
      &.fullscreen-container {
        width: 100%;
        margin: 0;
        border-radius: 10px 10px 0 0;
      }
    }
    .header {
      position: relative;
      width: 100%;
      text-align: center;
      padding: 0 30px;

      // border-bottom: 1px solid $devider;

      .title {
        color: $textColor;
        overflow: hidden;
        // margin: 0 14px;
        padding: 24px 0px 30px 0px;
        text-align: left;
        font-family: Poppins;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: 130%;
      }
    }
    .icon {
      position: absolute;
      width: 24px;
      height: 24px;
      right: 14px;
      top: 14px;
      bottom: 0;
      cursor: pointer;
    }
    .overlay-scrollbars {
      max-height: calc(100vh - 60px - 89px) !important;
    }
    .content {
      padding: 0 30px;
      width: 100%;
      height: auto;

      @include phone {
        height: auto;
      }
    }
    .footer {
      padding: 15px 20px 24px 20px;
      width: 100%;
      border-radius: $radius;
      @include flexRsa();
      @include phone {
        position: sticky;
        bottom: 0;
        background: $secondary;
        z-index: 101;
      }
    }
  }
}
</style>
