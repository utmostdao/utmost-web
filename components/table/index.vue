<template>
  <div class="table-component">
    <div
      :style="{
        overflow: scroll && (scroll.x || scroll.y) ? 'auto' : undefined,
      }"
      class="table-wrapper"
      :class="{
        'table-wrapper-border': bordered,
        loading: loading,
      }"
    >
      <table :style="tableStyle" cellspacing="0" class="table">
        <thead class="table-head">
          <tr class="table-head-row">
            <th v-if="rowSelection" class="head-row-select-cell" @click.stop>
              <TableSelectCell
                v-if="rowSelection.type === 'checkbox'"
                :type="rowSelection.type"
                :checked="rowSelectedKeys.length > 0"
                @change="($ev) => onRowSelection($ev, {}, 0, 'all')"
              />
            </th>
            <th
              v-for="column of columns"
              :key="column.id"
              class="head-row-cell"
              :class="{ [`head-row-cell-${size}`]: !!size }"
              :style="tableBoxStyle(column)"
            >
              <span>{{ column.label }}</span>
            </th>
            <!-- width全部被赋值是显示； -->
            <th v-if="!columns.find((item) => item.width === undefined)" />
          </tr>
        </thead>
        <tbody v-if="data.length > 0" class="table-body">
          <template v-for="(item, index) of data">
            <tr
              :key="index"
              class="body-row"
              :class="{ 'body-row-selected': selectedIndex.includes(index) }"
              @click.stop="() => onRowClick(index, item)"
            >
              <td v-if="rowSelection" class="body-row-select-cell" @click.stop>
                <TableSelectCell
                  :type="rowSelection.type"
                  :checked="
                    rowKey
                      ? rowSelectedKeys.includes(item[rowKey])
                      : rowSelectedKeys.includes(index)
                  "
                  @change="($ev) => onRowSelection($ev, item, index)"
                />
              </td>
              <td
                v-for="(column, i) of columns"
                :key="i"
                :style="tableBoxStyle(column)"
                class="body-row-cell"
                :class="{ [`body-row-cell-${size}`]: !!size }"
                @dblclick="
                  (e) => {
                    if (!column.copy) return
                    copyData(item[column.id], e)
                  }
                "
              >
                <slot
                  v-if="column.slotName"
                  :name="column.slotName"
                  :text="item[column.id]"
                  :info="item"
                  :index="index"
                >
                  <span>{{ item[column.id] }} </span>
                </slot>
                <span v-else-if="column.render">
                  <div
                    v-if="column.ellipsis"
                    :title="item[column.id]"
                    :style="{
                      width: Number(column.width)
                        ? `${column.width}px`
                        : undefined,
                    }"
                    class="cell-ellipsis"
                  >
                    {{ column.render(item[column.id], item, index) }}
                  </div>

                  <template v-else>
                    {{ column.render(item[column.id], item, index) }}
                  </template>
                </span>
                <div
                  v-else-if="column.ellipsis"
                  :title="item[column.id]"
                  :style="{
                    width: Number(column.width)
                      ? `${column.width}px`
                      : undefined,
                  }"
                  class="cell-ellipsis"
                >
                  {{ item[column.id] }}
                </div>
                <span v-else> {{ item[column.id] }} </span>
              </td>
              <td
                v-if="isChildren"
                :style="{
                  textAlign: 'right',
                  padding: '0 10px',
                  width: '20px',
                }"
              >
                <span
                  class="arrow-expand"
                  :style="{
                    transform: `rotateZ(${
                      expandedKeys.includes(rowKey ? item[rowKey] : index)
                        ? 90
                        : 0
                    }deg)`,
                  }"
                >
                  <ArrowExpandIcon :rotate="-90" color="rgba(0,0,0,0.65)" />
                </span>
              </td>
              <td v-if="!columns.find((item) => item.width === undefined)" />
            </tr>
            <tr
              v-if="
                isChildren &&
                expandedKeys.includes(rowKey ? item[rowKey] : index)
              "
              :key="`child-${index}`"
            >
              <td
                :colspan="
                  !columns.find((item) => item.width === undefined)
                    ? columns.length + 1 + (isChildren ? 1 : 0)
                    : columns.length + (isChildren ? 1 : 0)
                "
              >
                <div class="table-children">
                  <slot name="children" :info="item" :index="index" />
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <template v-if="data.length === 0">
        <div class="table-empty">
          <img :src="emptyUrl" />
          <span class="tip">{{ $t('noData') }}</span>
        </div>
      </template>
    </div>
    <div v-if="loading" class="table-wrapper-loading">
      <SpinnerLoader :size="35" />
    </div>

    <!-- <div class="table-footer">footer</div> -->
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { TableScroll, RowSelection, TableColumn } from '~/types/table'

export default Vue.extend({
  name: 'TableComponent',
  props: {
    rowKey: {
      type: String,
      default: undefined,
    },
    bordered: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      default() {
        return []
      },
    } as PropOptions<TableColumn[]>,
    data: {
      type: Array,
      default() {
        return []
      },
    } as PropOptions<any[]>,
    scroll: {
      type: Object,
      default: undefined,
    } as PropOptions<TableScroll>,
    rowSelection: {
      type: Object,
      default: undefined,
    } as PropOptions<RowSelection>,
    selectedIndex: {
      type: Array,
      default: () => [],
    } as PropOptions<number[]>,
    size: {
      type: String,
      default: 'large',
    } as PropOptions<'small' | 'medium' | 'large'>,
  },
  data() {
    return {
      rowSelectedKeys: [] as (string | number)[],
      rowSelectedRows: [] as any[],
      expandedKeys: [] as (string | number)[],
      expandedRows: [] as any[],
      emptyUrl: require('~/assets/img/Empty.svg'),
    }
  },
  computed: {
    tableStyle() {
      const { scroll } = this
      return {
        minWidth: Number(scroll?.x) ? `${scroll.x}px` : undefined,
        height: Number(scroll?.y) ? `${scroll.y}px` : undefined,
      }
    },
    isChildren(): boolean {
      return !!this.$scopedSlots?.children
    },
  },
  watch: {
    'rowSelection.rowSelectedKeys': {
      immediate: true,
      handler() {
        this.rowSelectedKeys = this.rowSelection?.rowSelectedKeys || []
      },
    },
  },
  methods: {
    copyData(str: any, e: any) {
      this.$helpers.copyText(str.toString())

      const paths = (e as any).path
      const el = paths.find(
        (item: any) => item._prevClass === 'body-row-cell'
      ) as Element
      window.getSelection()?.selectAllChildren(el)
    },
    onRowClick(index: number, item: any) {
      if (this.isChildren) {
        const expandedKeys = [...this.expandedKeys]
        const key = this.rowKey ? item[this.rowKey] : index
        if (expandedKeys.includes(key)) {
          const i = expandedKeys.findIndex((k) => k === key)
          expandedKeys.splice(i, 1)
        } else {
          expandedKeys.push(key)
        }
        this.expandedKeys = [...expandedKeys]
      }
      this.$emit('onRowClick', item, index)
    },
    tableBoxStyle(item: any) {
      const style = item.style || {}
      if (item.fixed) {
        const type = typeof item.fixed
        style.position = 'sticky'
        style['backdrop-filter'] = 'blur(10px)'

        if (type === 'string') {
          if (['right', 'left'].includes(item.fixed)) {
            style[item.fixed] = 0
          } else {
            style.left = 0
          }
        }
      }
      return {
        ...style,
        width: Number(item.width)
          ? `${item.width}px`
          : `calc(100% / ${this.columns.length})`,
        padding: '0 1rem',
        textAlign: item.align || 'left',
      }
    },
    onRowSelection(
      val: string,
      info: { [key: string]: string },
      index: number,
      type?: string
    ) {
      const rowKey = this.rowKey

      if (type === 'all') {
        if (val) {
          this.rowSelectedKeys = [
            ...this.data.map((item: { [key: string]: any }, i) => {
              return rowKey ? item[rowKey] : i
            }),
          ]
          this.rowSelectedRows = [...this.data.map((item) => ({ ...item }))]
        } else {
          this.rowSelectedKeys = []
          this.rowSelectedRows = []
        }
      } else {
        const i = this.rowSelectedKeys.findIndex((k) => {
          return rowKey ? k === info[rowKey] : k === index
        })

        if (val || i === -1) {
          this.rowSelectedKeys.push(rowKey ? info[rowKey] : index)
          this.rowSelectedRows.push(info)
        } else {
          this.rowSelectedKeys.splice(i, 1)
          this.rowSelectedRows.splice(i, 1)
        }
      }

      this.rowSelection?.onChange?.(this.rowSelectedKeys, this.rowSelectedRows)
    },
  },
})
</script>

<style lang="scss" scoped>
.table-component {
  width: 100%;
  position: relative;
  padding: 0 20px 20px 20px;
  .table-wrapper {
    position: relative;
    transition: opacity 0.3s;

    &.loading {
      opacity: 0.4;
    }
    &.table-wrapper-border {
      border-top: 1px solid #f0f0f0;
      border-left: 1px solid #f0f0f0;

      .head-row-select-cell,
      .body-row-select-cell,
      .head-row-cell,
      .body-row-cell,
      .table-empty {
        border-bottom: 1px solid #f0f0f0;
        border-right: 1px solid #f0f0f0;
      }
    }

    .table {
      width: 100%;

      .table-head {
        .table-head-row {
          height: 60px;
          /* padding: 0 56px; */

          .head-row-cell {
            font-weight: 500;
            color: $textColorOp5;
            padding: 0;

            &.head-row-cell-small {
              font-size: 14px;
            }

            &.head-row-cell-medium {
              font-size: 16px;
            }
            &.head-row-cell-large {
              font-size: 14px;
            }
          }
        }
      }

      .table-body {
        .body-row {
          height: 50px;
          transition: 0.3s;

          &:hover {
            background-color: $secondary;
            cursor: pointer;
          }
          &.body-row-selected {
            background-color: $background;
          }
          .body-row-cell {
            font-size: 14px;
            font-weight: 400;
            color: $textColor;
            padding: 0;

            &.body-row-cell-small {
              font-size: 12px;
            }

            &.body-row-cell-medium {
              font-size: 13px;
            }
            &.body-row-cell-large {
              font-size: 16px;
            }

            .cell-ellipsis {
              display: block;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }

          .arrow-expand {
            width: 25px;
            height: 25px;
            transition: 0.3s;
            display: inline-block;
          }
        }
      }
    }

    .head-row-select-cell,
    .body-row-select-cell {
      width: 50px;
      padding: 0 10px;
      text-align: center;
      position: sticky;
      left: 0;
      backdrop-filter: blur(10px);
    }
  }

  .table-children {
    width: calc(100% - 20px);
    margin: 10px;
    border: 1px solid rgb(229 224 224 / 49%);
    border-radius: 4px;
    background-color: rgb(178 181 184 / 10%);

    .head-row-cell {
      &.head-row-cell-small {
        font-size: 12px !important;
      }

      &.head-row-cell-medium {
        font-size: 14px !important;
      }
      &.head-row-cell-large {
        font-size: 16px !important;
      }
    }

    .body-row-cell {
      font-size: 12px !important;
    }
  }

  .table-empty {
    width: 100%;
    height: 300px;
    @include flexCc;
    position: sticky;
    left: 0;

    .tip {
      color: $textColorOp5;
    }
  }

  .table-wrapper-loading {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    /* background-color: #ffff; */
    @include flexCc;

    &::after {
      pointer-events: auto;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 10;
      display: none \9;
      width: 100%;
      height: 100%;
      transition: all 0.3s;
      content: '';
      pointer-events: none;
    }
  }
}
</style>
