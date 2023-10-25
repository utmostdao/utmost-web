import { throttle } from './infinite-scroll'

function setSticky() {
  const top = this.options.margin ?? 74
  const bottom = this.options.bottom ?? 10
  let oldScroll = window.screenY
  this.listener = throttle(() => {
    const elHeight = this.el.offsetHeight
    const innerHeight = window.innerHeight
    const scrollY = window.scrollY
    if (elHeight + bottom < innerHeight - top) {
      this.el.style.top = `${top}px`
      return
    }
    this.el.stickyTop = this.el.stickyTop ?? top
    const minTop = innerHeight - elHeight - bottom
    const deltaX = scrollY - oldScroll
    this.el.stickyTop -= deltaX
    this.el.stickyTop = Math.min(top, Math.max(this.el.stickyTop, minTop))
    this.el.style.top = `${this.el.stickyTop}px`
    oldScroll = scrollY
  }, 10)
  this.listener()

  window.addEventListener('resize', this.listener)
  document.addEventListener('scroll', () => this.listener())
  this.vm.$on('hook:updated', () => {
    this.el.ctx.vm.$nextTick(() => {
      this.listener()
    })
  })
}

const directive = {
  bind(el, binding, vnode) {
    el.ctx = {
      el,
      vm: vnode.context,
      options: binding.value,
      stickyTop: undefined,
    }

    el.style.position = 'sticky'
    el.ctx.vm.$on('hook:mounted', function () {
      el.ctx.vm.$nextTick(function () {
        setSticky.call(el.ctx)
      })
    })
  },
  unbind(el) {
    window.removeEventListener('resize', el.ctx.listener)
  },
}

export default directive
