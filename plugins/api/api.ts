import { ApiProvider } from '~/types/api'
import { paths } from '~/types/swagger'
import { OpArgType, OpenapiPaths, OpReturnType } from '~/types/fetcher'

export class Api {
  constructor(apiProvider: ApiProvider) {
    this.apiProvider = apiProvider
  }

  apiProvider: ApiProvider

  setToken(token?: string) {
    if (!token) {
      this.apiProvider.axios.setToken(false)
    } else {
      this.apiProvider.axios.setToken(token, 'Bearer')
    }
  }

  private fetcher<Paths>() {
    return {
      path: <P extends keyof Paths>(path: P) => ({
        method: <M extends keyof Paths[P]>(method: M) => ({
          create: () => {
            switch (method) {
              case 'get':
                return (
                  params: OpArgType<Paths[P][M]>,
                  progress?: boolean,
                  cancel?: () => void
                ): Promise<OpReturnType<Paths[P][M]>> => {
                  const { CancelToken } = this.apiProvider.axios
                  return this.apiProvider.axios.$get(path as string, {
                    params,
                    progress,
                    cancelToken: new CancelToken((c) => {
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      cancel = c
                    }),
                  })
                }
              case 'post':
                return (
                  params: OpArgType<Paths[P][M]>,
                  progress: boolean = false
                ): Promise<OpReturnType<Paths[P][M]>> => {
                  return this.apiProvider.axios.$post(path as string, params, {
                    progress,
                  })
                }
              case 'put':
                return (
                  params: OpArgType<Paths[P][M]>,
                  progress: boolean = false
                ): Promise<OpReturnType<Paths[P][M]>> => {
                  return this.apiProvider.axios.$put(path as string, params, {
                    progress,
                  })
                }
              case 'delete':
                return (
                  params: OpArgType<Paths[P][M]>,
                  progress: boolean = false
                ): Promise<OpReturnType<Paths[P][M]>> => {
                  return this.apiProvider.axios.$delete(path as string, {
                    data: params,
                    progress,
                  })
                }
              default:
                break
            }
          },
        }),
      }),
    }
  }

  private Fetcher = {
    for: <Paths extends OpenapiPaths<Paths>>() => this.fetcher<Paths>(),
  }

  ft = this.Fetcher.for<paths>()
}
