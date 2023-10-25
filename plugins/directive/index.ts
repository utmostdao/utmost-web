import Vue from 'vue'
import throttle from './throttle'
import infiniteScrollBody from './infinite-scroll'
import stickyBottom from './sticky-bottom'

Vue.directive('InfiniteScrollBody', infiniteScrollBody)
Vue.directive('StickyBottom', stickyBottom)
Vue.directive('throttle', throttle)
