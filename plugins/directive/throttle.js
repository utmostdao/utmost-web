/* eslint-disable no-console */
/**
 * @author CRM组
 * @date 2020/08/19
 * @description click节流，默认500ms
 */

// 获取数据类型
const getInstance = function (data) {
  // "[object Array]"
  const instanceStr = Object.prototype.toString.call(data)
  const index = instanceStr.indexOf(' ')
  return instanceStr.substring(index + 1, instanceStr.length - 1)
}
const checkBindingValue = function (data) {
  if (data === undefined) return false
  if (typeof data !== 'boolean') {
    console.error(
      `error in [v-throttle="value"], invalid for "value", Expected Boolean, got ${getInstance(
        data
      )}.`
    )
    return false
  } else {
    return data
  }
}
let sdBindingValue = false // 外界影响节流因素
export default {
  inserted: (el, binding) => {
    let timer = null
    const timeout = +(binding.arg || 0.5)
    // 判断过期时间
    if (Number.isNaN(timeout)) {
      console.error(
        `error in [v-throttle:arg], invalid for "arg", Expected Numeric, got ${getInstance(
          binding.arg
        )}.`
      )
      return
    }
    if (timeout < 0) {
      console.error(
        'error in [v-throttle:arg], invalid for "arg", Expected Nonnegative number'
      )
      return
    }
    // 判断外界影响节流因素
    sdBindingValue = checkBindingValue(binding.value)
    el.parentElement &&
      el.parentElement.addEventListener(
        'click',
        (e) => {
          if (timer || sdBindingValue) {
            e.stopPropagation()
            return
          }
          timer = setTimeout(() => {
            clearTimeout(timer)
            timer = null
            // 未给值默认是500ms
          }, timeout * 1000)
        },
        true
      )
  },
  update: (_, binding) => {
    // 判断外界影响节流因素
    sdBindingValue = checkBindingValue(binding.value)
  },
}
