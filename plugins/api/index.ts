import { Plugin } from '@nuxt/types'
import { Yapi } from './yapi'
import { ApiProvider } from '~/types/api'

export interface ApiInject {
  yapi: Yapi
  provider: any
}
const api: Plugin = ({ $axios }, inject) => {
  const apiProvider: ApiProvider = {
    axios: $axios,
  }
  inject('api', {
    yapi: new Yapi(apiProvider),
  } as ApiInject)
}

export default api
