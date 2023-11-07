<template>
  <div class="slippage-setting">
    <!-- <div class="title">{{ $t('settings') }}</div> -->

    <div class="warning">
      <div class="warning-title">
        {{ $t('slippageWaringTitle') }}
      </div>
      <div class="info">
        {{ $t('slippageDialog.high') }}
      </div>
    </div>
    <div class="selector">
      <!-- <div class="indicator" :style="selectorStyle"></div> -->
      <div class="options">
        <div
          v-for="(option, index) of options"
          :key="index"
          class="option"
          :class="{ selected: selected === index }"
          @click="() => select(index)"
        >
          {{ option * 100 }}%
        </div>
        <div
          class="option"
          :class="{ selected: selected === 3 }"
          @click="() => select(3)"
        >
          <span v-if="selected !== 3"> {{ $t('gasDialog.diy') }}</span>
          <el-input
            v-else-if="selected === 3"
            v-model="customSlip"
            class="input"
            type="number"
            :placeholder="$t('gasDialog.diy')"
            autofocus
          >
            <template #suffix>
              <span>%</span>
            </template>
          </el-input>
        </div>
      </div>
    </div>
    <!-- <transition name="fade">
      <div v-if="selected === 3" class="custom">
        <el-input
          v-model="customSlip"
          class="input"
          type="number"
          placeholder="Slip"
        ></el-input>
        <span style="margin-left: 10px">%</span>
      </div>
    </transition> -->
    <div v-if="errStr" class="value-error">
      {{ errStr }}
    </div>
    <div v-else-if="warningStr" class="value-warning">
      {{ warningStr }}
    </div>
    <!-- <primary-button v-close-popper class="button" @click="confirm">{{
      $t('confirm')
    }}</primary-button> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'SwapSlippageSetting',
  data() {
    return {
      show: false,
      loading: false,
      options: [0.01, 0.03, 0.05],
      selected: 1,
      customSlip: undefined as number | undefined,
      buttonDisabled: false,
      errStr: '',
      warningStr: '',
    }
  },
  computed: {
    selectorStyle(): any {
      const index = this.selected
      const left = ['0', '25%', '50%', '75%'][index]
      return {
        left,
      }
    },
    currentSlip(): number {
      return this.$accessor.swap.slippage
    },
  },
  watch: {
    customSlip(slip: number) {
      if (slip < 0 || slip >= 100) {
        this.errStr = this.$t('slippageDialog.max').toString() + ' 100%'
        return
      }
      Number(slip).toFixed(2)
      this.customSlip = Number(Number(slip).toFixed(2))
      if (this.selected === 3) {
        this.$accessor.swap.setSlippage(this.customSlip / 100)
      }
    },
    currentSlip() {
      const slip = this.currentSlip * 100
      if (slip < 1) {
        this.errStr = ''
        this.warningStr = 'Slippage too low'
      } else if (slip > 10) {
        this.errStr = ''
        this.warningStr = 'Slippage too high'
      } else {
        this.errStr = ''
        this.warningStr = ''
      }
    },
  },
  mounted() {
    if (!this.options.includes(this.currentSlip)) {
      this.selected = 3
      this.customSlip = this.currentSlip * 100
    } else {
      const i = this.options.findIndex((num) => num === this.currentSlip)
      this.selected = i !== -1 ? i : 2
    }
  },
  methods: {
    select(index: number) {
      const old = this.options[this.selected]
      this.selected = index
      if (index !== 3) {
        this.customSlip = 0
        this.errStr = ''

        const slippage = this.options[index] as number
        this.$accessor.swap.setSlippage(slippage)
      } else {
        if (this.selected === 3 && this.customSlip) {
          return
        }
        this.customSlip = old * 100
      }
    },
    cancel(): void {
      this.loading = false
      this.$confirmDialog.option.rejecter?.()
    },
    confirm() {
      if (this.selected === 3) {
        this.$accessor.swap.setSlippage(this.currentSlip)
        if (isNaN(this.currentSlip)) {
          this.currentSlip = 0
        }
      }
    },
  },
})
</script>

<style lang="scss" scoped>
::v-deep .el-input__suffix {
  display: flex;
  align-items: center;
}

::v-deep .el-input__inner {
  border-radius: 0 !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.slippage-setting {
  width: 100%;
  // padding: 16px 20px;
  @include flexC;
  align-items: flex-start;
  margin-bottom: 30px;

  .title {
    color: $textColor;
    font-family: Poppins;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;
  }
  .warning {
    @include flexC;
    align-items: flex-start;
    .warning-title {
      color: $textColor;
      font-family: Poppins;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 130%;
    }
    .info {
      color: $textColorOp5;
      line-height: 16px;
      margin-top: 6px;
      font-family: Poppins;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 130%;
    }
  }
  .selector {
    margin-top: 24px;
    width: 100%;
    height: 40px;
    border-radius: 20px;
    position: relative;

    .options {
      left: 0;
      position: absolute;
      height: 100%;
      display: grid;
      align-items: center;
      justify-items: center;
      grid-template-columns: repeat(4, 1fr);
      width: 100%;
      z-index: 5;
      cursor: pointer;
      color: $textColor;
      gap: 20px;
      .option {
        width: 100%;
        height: 40px;
        flex-shrink: 0;
        text-align: center;
        border-radius: 4px;
        border: 1px solid $border;
        @include flexCc;
        color: $textColor;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 130%;
        overflow: hidden;

        .input {
          width: 100%;
          height: 100%;
        }
      }
      .selected {
        transition: color 0.3s ease-out;
        border-color: $primary;
        color: $primary;
      }
    }
  }
  .custom {
    color: $textColor;
    @include flexR;
  }
  .value-error {
    font-size: 12px;
    color: $error;
  }

  .value-warning {
    font-size: 12px;
    color: $warning;
  }
  .button {
    margin: 30px 0 12px 0;
    height: 40px;
    width: 100%;
    &.plain-button {
      width: 100%;
      height: 60px;
    }
  }
}
::v-deep .el-input__inner {
  width: 100% !important;
  height: 100%;
  padding: 0 4px;
  color: $primary;
  background-color: transparent;
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
  text-align: center;
  width: 40px;
  border: 0;
  -moz-appearance: textfield;
}
::v-deep .el-input__inner::-webkit-inner-spin-button,
.el-input__inner::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>
