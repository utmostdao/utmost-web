export interface TableScroll {
  x?: number
  y?: number
}

export interface RowSelection {
  type?: 'checkbox' | 'radio' // default: 'checkbox',
  rowSelectedKeys?: (string | number)[]
  onChange?: (keys: (string | number)[], rows: any[]) => void
}

export interface TableColumn {
  id: string | number
  label?: string
  width?: number
  align?: 'left' | 'center' | 'right' // default: left
  slotName?: string
  copy?: boolean
  render?: (text: any, info: any, index: number) => string | number
  style?: { [key: string]: string }
  fixed?: 'right' | 'left' | true
  ellipsis?: boolean // false
}

export type Table = {
  rowKey?: string | number // default: index
  bordered?: boolean // default: false
  scroll?: TableScroll
  rowSelection?: RowSelection
  data: { [key: string]: any }
  columns: TableColumn[]
  loading?: boolean
  size?: 'small' | 'medium' | 'large'
  onRowClick?: (item: any, index: number) => void // Event, row click evnet
}
