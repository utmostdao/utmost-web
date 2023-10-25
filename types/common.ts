export interface ConfirmMessage {
  title: string
  content: string
  confirmButtonText?: string
  cancelButtonText?: string
  useLoading?: boolean
}

export interface ResolveType {
  loading: (is: boolean) => void
}

export interface ConfirmOptions {
  resolver?: (value?: ResolveType) => Promise<any> | void
  rejecter?: () => void
}

export interface ConfirmInject {
  (message: ConfirmMessage): Promise<ResolveType>
  option: ConfirmOptions
}
