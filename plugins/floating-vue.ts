import Vue from 'vue'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

Vue.use(FloatingVue, {
  themes: {
    'dapp-menu': {
      triggers: ['click'],
      autoHide: true,
      distance: 0,
      placement: 'bottom-start',
    },
    'dapp-dropdown': {
      triggers: ['click'],
      placement: 'bottom-start',
      distance: 6,
      autoHide: true,
      disposeTimeout: 10000000,
    },
    'dapp-tooltip': {
      triggers: ['hover'],
      autoHide: true,
      placement: 'right',
    },
    'dapp-tooltip-bottom': {
      triggers: ['hover'],
      autoHide: true,
      placement: 'bottom',
    },
  },
})
