export type Method =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'head'
  | 'options'

export type OpenapiPaths<Paths> = {
  [P in keyof Paths]: {
    [M in Method]?: unknown
  }
}

export type OpArgType<OP> = OP extends {
  // 判断表单数据
  parameters?: {
    formData: unknown
  }
}
  ? FormData
  : OP extends {
      parameters?: {
        path?: infer P
        query?: infer Q
        body?: infer B
        header?: unknown // ignore
        cookie?: unknown // ignore
      }
      // openapi 3
      requestBody?: {
        content: {
          'application/json': infer RB
        }
      }
    }
  ? P & Q & (B extends Record<string, unknown> ? B[keyof B] : unknown) & RB
  : Record<string, never>

export type GetOpArgType<OP> = OP extends {
  // 判断表单数据
  parameters?: {
    formData: unknown
  }
}
  ? FormData
  : OP extends {
      parameters?: {
        path?: infer P
        query?: infer Q
        body?: unknown
        header?: unknown // ignore
        cookie?: unknown // ignore
      }
      // openapi 3
      requestBody?: {
        content: {
          // 'application/json': infer RB
        }
      }
    }
  ? P & Q
  : Record<string, never>

type OpResponseTypes<OP> = OP extends {
  responses: infer R
}
  ? {
      // eslint-disable-next-line no-use-before-define
      [S in keyof R]: R[S] extends { schema?: infer S } // openapi 2
        ? S
        : R[S] extends { content: { 'application/json': infer C } } // openapi 3
        ? C
        : S extends 'default'
        ? R[S]
        : unknown
    }
  : never

type _OpDataType<T> = 'data' extends keyof T ? T['data'] : unknown

type _OpReturnType<T> = 200 extends keyof T
  ? _OpDataType<T[200]>
  : 201 extends keyof T
  ? T[201]
  : 'default' extends keyof T
  ? T['default']
  : unknown

export type OpReturnType<OP> = _OpReturnType<OpResponseTypes<OP>>

type _OpDefaultReturnType<T> = 'default' extends keyof T
  ? T['default']
  : unknown

export type OpDefaultReturnType<OP> = _OpDefaultReturnType<OpResponseTypes<OP>>

// private symbol to prevent narrowing on "default" error status
const never: unique symbol = Symbol('default')

type _OpErrorType<T> = {
  [S in Exclude<keyof T, 200 | 201>]: {
    status: S extends 'default' ? typeof never : S
    data: T[S]
  }
}[Exclude<keyof T, 200 | 201>]

type Coalesce<T, D> = [T] extends [never] ? D : T

export type ApiResponse<R = any> = {
  readonly headers: Headers
  readonly url: string
  readonly ok: boolean
  readonly status: number
  readonly statusText: string
  readonly data: R
}
// coalesce default error type
export type OpErrorType<OP> = Coalesce<
  _OpErrorType<OpResponseTypes<OP>>,
  { status: number; data: any }
>

export type CustomRequestInit = Omit<RequestInit, 'headers'> & {
  readonly headers: Headers
}

export type Fetch = (
  url: string,
  init: CustomRequestInit
) => Promise<ApiResponse>

export type _TypedFetch<OP> = (
  arg: OpArgType<OP>,
  init?: RequestInit
) => Promise<ApiResponse<OpReturnType<OP>>>

export type Request = {
  baseUrl: string
  method: Method
  path: string
  queryParams: string[] // even if a post these will be sent in query
  payload: any
  init?: RequestInit
  fetch: Fetch
}
