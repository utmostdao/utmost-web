import { Plugin } from '@nuxt/types'
import { AxiosResponse } from 'axios'

const axios: Plugin = ({ $axios, i18n }) => {
  const responseHandler = (response: AxiosResponse<any>) => {
    if (response.data.code === '000') return Promise.resolve(response.data)
    throw new Error(response?.data?.msg ?? '')
  }

  $axios.setHeader('Accept-Language', i18n.locale)
  $axios.setHeader('X-Convert', 'USD')
  $axios.onResponse(responseHandler)
}

export default axios
