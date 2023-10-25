<template>
  <div class="checkbox-wrapper">
    <input
      :type="type"
      class="cell-input-checkbox"
      :checked="checked"
      @change="onChnage"
    />
    <div class="checkbox-inner" :class="{ checked: localChecked }">
      <!-- <span v-if="localChecked" class="done">
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" >
          <path
            d="m8.229 13.771-3.208-3.229.729-.75 2.479 2.458 6.021-6 .729.771Z"
          />
        </svg>
      </span> -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
export default Vue.extend({
  name: 'TableSelectCell',
  props: {
    type: {
      type: String,
      default: 'checkbox',
    } as PropOptions<'checkbox' | 'radio'>,
    checked: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      localChecked: false,
    }
  },
  computed: {
    inputType() {
      return ['checkbox', 'radio'].includes(this.type) ? this.type : 'checkbox'
    },
  },
  watch: {
    checked: {
      immediate: true,
      handler() {
        this.localChecked = this.checked
      },
    },
  },
  methods: {
    onChnage(e: InputEvent) {
      const checked = (e as any).target.checked
      this.localChecked = checked

      this.$emit('input:updata', checked)
      this.$emit('change', checked)
    },
  },
})
</script>

<style lang="scss" scoped>
.checkbox-wrapper {
  display: inline-block;
  width: 16px;
  height: 16px;
  position: relative;
  .cell-input-checkbox {
    cursor: pointer;
    transition: 0.3s;
    width: 16px;
    height: 16px;
    opacity: 0;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

  .checkbox-inner {
    width: 100%;
    height: 100%;
    border-radius: 2px;
    border: 1px solid #d9d9d9;

    &.checked {
      border: 0;
      background-color: #1890ff;

      &::after {
        position: absolute;
        display: table;
        border: 2px solid #fff;
        border-top: 0;
        border-left: 0;
        transform: rotate(45deg) scale(1) translate(-50%, -50%);
        opacity: 1;
        transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
        content: ' ';
        top: 47%;
        left: 26.5%;
        display: table;
        width: 3.5px;
        height: 7.5px;
      }
      /*
      .done {
        display: flex;
        align-items: center;
        justify-content: center;
      } */
    }
  }
}
</style>
