/* eslint-disable no-unused-vars */
import React, { useState, useReducer, useEffect, useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  useTable,
  useSortBy,
  useRowSelect,
  useFilters,
  useColumnOrder,
  useResizeColumns,
  useBlockLayout,
  useFlexLayout,
} from 'react-table';
import Context from './context';
import cn from 'classnames';

import Header from './table/ckHeader';
import Body from './table/ckBody';
import Footer from './table/ckFooter';

import { DefaultColumnFilter, CheckboxFilter, SelectColumnFilter } from './filter/select';
import Setting from './components/setting';

// Reducer状态配置
const initialState = {
  rowHeight: 0, // 行的高度
  totalLen: 0, // 总行数
  curScroll: {
    scrollLeft: 0,
    scrollTop: 0,
  },
  headerElem: null,
  bodyElem: null,
  footerElem: null,
};

// 表格基础配置
const initConfig = {
  rowConfig: {}, // 行配置
  columnConfig: {}, // 列配置
  checkboxConfig: {}, // 复选框配置
}

const reducer = (state, action) => {
  const { curScroll, headerElem, bodyElem, footerElem } = action;

  switch (action.type) {
    case 'changeScroll':
      return {
        ...state,
        curScroll,
      };
    case 'headerElem':
      return {
        ...state,
        headerElem,
      };
    case 'bodyElem':
      return {
        ...state,
        bodyElem,
      };
    case 'footerElem':
      return {
        ...state,
        footerElem,
      };
    default:
      throw new Error();
  }
};


const Table = forwardRef((props, ref) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data, columns, height = '100%', showFooter, size = 'small', border = 'full', filterTypes, toolbar = {} } = props;

  // 列处理，固定列分组
  const resetColumns = useMemo(() => {
    console.log('filter:')
    const leftColumn = [];
    const rightColumn = [];
    const filterColumn = columns.filter(col => {
      col.fixed === 'left' && leftColumn.push(col);
      col.fixed === 'right' && rightColumn.push(col);
      if (col.filter && !col.Filter) {
        switch (col.filter) {
          case 'input':
            col.Filter = DefaultColumnFilter
            break;
          case 'select':
            col.Filter = SelectColumnFilter
            break;
          case 'checkbox':
            col.Filter = CheckboxFilter
            break;

          default:
            col.Filter = CheckboxFilter
            break;
        }
      };
      return !col.fixed;
    })
    return [...leftColumn, ...filterColumn, ...rightColumn]
  }, [columns])

  const hiddenColumns = useMemo(() => {
    const fields = [];
    const filterEvent = (arr) => {
      arr.map(v => {
        if (v.columns) {
          filterEvent(v.columns)
        }
        const bol = typeof v.visible === 'boolean' && !v.visible;
        bol && fields.push(v.accessor);
        return v;
      })
    }
    filterEvent(resetColumns);
    return fields;
  }, []);

  // 列过滤
  const resetFilterTypes = React.useMemo(
    () => ({
      ...filterTypes,
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
      checkbox: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return (!!rowValue && filterValue.length)
            ? filterValue.includes(rowValue)
            : true
        })
      },
      // Or, override the default text filter to use
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    [filterTypes]
  )

  const tableInstance = useTable(
    {
      columns: resetColumns,
      data,
      defaultColumn: { width: 250, minWidth: 60, Filter: CheckboxFilter },
      filterTypes: resetFilterTypes,
      initialState: {
        hiddenColumns,
      },
    },
    useFlexLayout, // 三种布局方式，固定宽度/占满宽度/绝对定位
    useResizeColumns,
    useFilters, // 列数据过滤
    useSortBy, // 排序
    useRowSelect, // 复选框
    useColumnOrder, // 列排序
  );

  const { getTableProps, selectedFlatRows } = tableInstance;

  // 向外暴露事件
  useImperativeHandle(ref, () => ({
    getCheckboxRecords: selectedFlatRows.map(v => v.original),
    tableInstance,
  }));

  return (
    <Context.Provider value={{ dispatch, state, tableInstance, ...initConfig, ...props }}>
      <div className={cn('ck-table', size, `border-${border}`)} {...getTableProps({ style: { height } })}>
        {toolbar.setting && <Setting />}
        <Header />
        <Body />
        {showFooter && <Footer />}
      </div>
    </Context.Provider>
  );
});

export default Table;
