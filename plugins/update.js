export default function () {
  window.onNuxtReady(() => {
    window.$nuxt.$on('nuxt-detect-update', (version) => {
      localStorage.setItem('version', version)
      window.location.reload(true)
    })
  })
}
