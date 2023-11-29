/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable require-await */
/* eslint-disable camelcase */
const options = JSON.parse('<%= JSON.stringify(options) %>')

export default ({ app }) => {
  let last_check_time = new Date()
  app.router.afterEach(async () => {
    const last_check_interval = new Date() - last_check_time
    if (last_check_interval >= options.check_interval) {
      last_check_time = new Date()
      const localVersion = localStorage.getItem('version') ?? '1.0.0'
      const version = await get_remote_version()
      if (version !== localVersion) {
        window.$nuxt.$emit('nuxt-detect-update', version)
      }
    }
  })
}

async function get_remote_version() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', options.path)
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          const { version } = JSON.parse(xhr.responseText)
          if (version) {
            resolve(version)
          } else {
            reject('Malformed version response.')
          }
        } catch (err) {
          reject(err)
        }
      } else {
        reject('Request failed.')
      }
    }
    xhr.send()
  })
}
