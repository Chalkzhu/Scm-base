import React, { useState, useReducer, useMemo, forwardRef, useImperativeHandle } from 'react';
import { createTable, useTableInstance, getCoreRowModelSync, getSortedRowModelSync, getColumnFilteredRowModelSync } from '@tanstack/react-table';

import cn from 'classnames';
import Context from './context';

import Header from './table/ckHeader';
import Body from './table/ckBody';
import Footer from './table/ckFooter';

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

let table = createTable();

const Table = forwardRef((props, ref) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data, columns, height = '100%', showFooter, size = 'small', border = 'full', filterTypes } = props;

  // 表格基础配置
  const initConfig = useMemo(() => {
    const { toolbar, rowConfig, columnConfig, checkboxConfig, sortConfig } = props;
    return {
      toolbar: { ...toolbar }, // 功能区域配置
      rowConfig: { isHover: false, ...rowConfig }, // 行配置
      sortConfig: { trigger: 'default', remote: false, ...sortConfig }, // 排序配置
      columnConfig: { ...columnConfig }, // 列配置
      checkboxConfig: { Control: null, ...checkboxConfig }, // 复选框配置
    }
  }, []);

  // 列过滤
  const resetFilterTypes = React.useMemo(
    () => ({
      ...filterTypes,
      select: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .includes(String(filterValue).toLowerCase())
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
  );

  const tableInstance = useTableInstance(table,
    {
      data,
      columns,
      defaultColumn: { width: 250, minWidth: 60, filterType: 'checkbox' },
      filterTypes: resetFilterTypes,
      columnResizeMode: 'onEnd',
      getCoreRowModel: getCoreRowModelSync(),
      getSortedRowModel: getSortedRowModelSync(),
      getColumnFilteredRowModel: getColumnFilteredRowModelSync(),
    },
  );
  // console.log('tableInstance', tableInstance);
  // 状态可控管理 Override the state managers for the table instance to your own
  const [optionsState, setOptionsState] = useState(tableInstance.initialState);
  tableInstance.setOptions(prev => ({
    ...prev,
    state: optionsState,
    onStateChange: setOptionsState,
  }))

  const { getTableProps, getSelectedRowModel } = tableInstance;


  // 向外暴露事件
  useImperativeHandle(ref, () => ({
    getCheckboxRecords: getSelectedRowModel().flatRows.map(v => v.values),
    getInstance: () => tableInstance,
  }));

  return (
    <Context.Provider value={{ dispatch, state, tableInstance, ...props, ...initConfig }}>
      <div className={cn('ck-table', size, `border-${border}`)} {...getTableProps({ style: { height } })}>
        {initConfig.toolbar.setting && <Setting />}
        <Header />
        <Body />
        {showFooter && <Footer />}
      </div>
    </Context.Provider>
  );
});

export default Table;
