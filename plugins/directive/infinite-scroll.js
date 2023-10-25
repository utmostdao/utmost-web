// fork from https://github.com/ElemeFE/vue-infinite-scroll/blob/775b7d386ff4e609eb3360a4ccecee7d9a015c63/src/directive.js

const ctx = '@@InfiniteScrollBody'
export const throttle = function (fn, delay) {
  let now, lastExec, timer, context, args //eslint-disable-line

  const execute = function () {
    fn.apply(context, args)
    lastExec = now
  }

  return function () {
    context = this
    args = arguments

    now = Date.now()

    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    if (lastExec) {
      const diff = delay - (now - lastExec)
      if (diff < 0) {
        execute()
      } else {
        timer = setTimeout(() => {
          execute()
        }, diff)
      }
    } else {
      execute()
    }
  }
}

const getScrollTop = function () {
  return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop)
}

const getVisibleHeight = function () {
  return document.documentElement.clientHeight
}

const isAttached = function (element) {
  let currentNode = element.parentNode
  while (currentNode) {
    if (currentNode.tagName === 'HTML') {
      return true
    }
    if (currentNode.nodeType === 11) {
      return false
    }
    currentNode = currentNode.parentNode
  }
  return false
}

const doBind = function () {
  if (this.binded) return // eslint-disable-line
  this.binded = true

  const directive = this
  const element = directive.el

  const throttleDelayExpr = element.getAttribute(
    'infinite-scroll-throttle-delay'
  )
  let throttleDelay = 200
  if (throttleDelayExpr) {
    throttleDelay = Number(directive.vm[throttleDelayExpr] || throttleDelayExpr)
    if (isNaN(throttleDelay) || throttleDelay < 0) {
      throttleDelay = 200
    }
  }
  directive.throttleDelay = throttleDelay

  directive.scrollEventTarget = window
  directive.scrollListener = throttle(
    doCheck.bind(directive),
    directive.throttleDelay
  )
  directive.scrollEventTarget.addEventListener(
    'scroll',
    directive.scrollListener
  )

  this.vm.$on('hook:activated', () => {
    this.binded = true
    directive.scrollEventTarget.addEventListener(
      'scroll',
      directive.scrollListener
    )
  })

  this.vm.$on('hook:beforeDestroyed', () => {
    this.binded = false
    directive.scrollEventTarget.removeEventListener(
      'scroll',
      directive.scrollListener
    )
  })

  this.vm.$on('hook:deactivated', () => {
    this.binded = false
    directive.scrollEventTarget.removeEventListener(
      'scroll',
      directive.scrollListener
    )
  })

  const disabledExpr = element.getAttribute('infinite-scroll-disabled')
  let disabled = false

  if (disabledExpr) {
    this.vm.$watch(disabledExpr, function (value) {
      directive.disabled = value
      if (!value && directive.immediateCheck) {
        doCheck.call(directive)
      }
    })
    disabled = Boolean(directive.vm[disabledExpr])
  }
  directive.disabled = disabled

  const distanceExpr = element.getAttribute('infinite-scroll-distance')
  let distance = 10
  if (distanceExpr) {
    distance = Number(directive.vm[distanceExpr] || distanceExpr)
    if (isNaN(distance)) {
      distance = 10
    }
  }
  directive.distance = distance

  const immediateCheckExpr = element.getAttribute(
    'infinite-scroll-immediate-check'
  )
  let immediateCheck = true
  if (immediateCheckExpr) {
    immediateCheck = Boolean(directive.vm[immediateCheckExpr])
  }
  directive.immediateCheck = immediateCheck

  if (immediateCheck) {
    doCheck.call(directive)
  }

  const eventName = element.getAttribute('infinite-scroll-listen-for-event')
  if (eventName) {
    directive.vm.$on(eventName, function () {
      doCheck.call(directive)
    })
  }
}

const doCheck = function (force) {
  const scrollEventTarget = this.scrollEventTarget
  const distance = this.distance

  if (force !== true && this.disabled) return //eslint-disable-line
  const viewportScrollTop = getScrollTop(scrollEventTarget)
  const viewportBottom = viewportScrollTop + getVisibleHeight(scrollEventTarget)

  let shouldTrigger = false

  const elementBottom = document.documentElement.scrollHeight

  shouldTrigger = viewportBottom + distance >= elementBottom

  if (this.binded && shouldTrigger && this.expression) {
    this.expression()
  }
}

export default {
  bind(el, binding, vnode) {
    el[ctx] = {
      el,
      vm: vnode.context,
      expression: binding.value,
    }
    const args = arguments
    el[ctx].vm.$on('hook:mounted', function () {
      el[ctx].vm.$nextTick(function () {
        if (isAttached(el)) {
          doBind.call(el[ctx], args)
        }

        el[ctx].bindTryCount = 0

        const tryBind = function () {
          if (el[ctx].bindTryCount > 10) return //eslint-disable-line
          el[ctx].bindTryCount++
          if (isAttached(el)) {
            doBind.call(el[ctx], args)
          } else {
            setTimeout(tryBind, 50)
          }
        }

        tryBind()
      })
    })
  },

  unbind(el) {
    if (el && el[ctx] && el[ctx].scrollEventTarget)
      el[ctx].scrollEventTarget.removeEventListener(
        'scroll',
        el[ctx].scrollListener
      )
  },
}
