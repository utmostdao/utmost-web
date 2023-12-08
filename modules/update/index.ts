/* eslint-disable camelcase */
import path from 'path'
import { Module } from '@nuxt/types/config/module'

interface ModuleOptions {
  path: string
  check_interval: number
}

const default_options: ModuleOptions = {
  path: '/version.json',
  check_interval: 5, // 5 minutes
}

const nuxt_module: Module<Partial<ModuleOptions>> = function (module_options) {
  const options: ModuleOptions = {
    ...default_options,
    ...this.options.update,
    ...module_options,
  }
  // if (!version) {
  //   console.log('nuxt-detect-update: version not provided, disabled.')
  //   return
  // }
  // this.addServerMiddleware({
  //   path: options.path,
  //   handler(_, res) {
  //     res.statusCode = 200
  //     res.setHeader('Content-Type', 'application/json')
  //     res.setHeader('Cache-Control', 'no-cache')
  //     res.end(JSON.stringify({ version }))
  //   },
  // })
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options,
    mode: 'client',
  })
}

export default nuxt_module
