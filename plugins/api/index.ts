import { Plugin } from '@nuxt/types'
import { AxiosResponse } from 'axios'
import { Yapi } from './yapi'
import { CrossYapi } from './crossYapi'
import { ApiProvider } from '~/types/api'

export interface ApiInject {
  yapi: Yapi
  crossYapi: CrossYapi
  provider: any
}
const api: Plugin = ({ $axios, i18n, $config }, inject) => {
  const apiProvider: ApiProvider = {
    axios: $axios,
  }
  const crossApiProvider: ApiProvider = {
    axios: $axios.create({
      headers: {
        common: {
          Accept: 'application/json, text/plain, */*',
        },
      },
    }),
  }
  crossApiProvider.axios.setBaseURL($config.crossBaseUrl)
  const responseHandler = (response: AxiosResponse<any>) => {
    if (response.data.code === '000') return Promise.resolve(response.data)
    throw new Error(response.data.msg)
  }
  crossApiProvider.axios.setHeader('Accept-Language', i18n.locale)
  crossApiProvider.axios.setHeader('X-Convert', 'USD')
  crossApiProvider.axios.onResponse(responseHandler)

  inject('api', {
    yapi: new Yapi(apiProvider),
    crossYapi: new CrossYapi(crossApiProvider),
  } as ApiInject)
}

export default api
