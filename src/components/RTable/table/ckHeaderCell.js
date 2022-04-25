import React, { useState, useContext, useMemo, useCallback } from 'react';
import cn from 'classnames';
import { Dropdown } from 'antd';
import Context from '../context';
import CheckBox from '../components/Checkbox.js';

import { DefaultColumnFilter, CheckboxFilter, SelectColumnFilter } from '../filter/select';

const builtInFilterType = {
  text: DefaultColumnFilter,
  checkbox: CheckboxFilter,
  select: SelectColumnFilter
};

// 遍历子列（遍历分组列）
// function getLeafHeaders(header) {
//   const leafHeaders = []
//   const recurseHeader = header => {
//     if (header.columns && header.columns.length) {
//       header.columns.map(recurseHeader)
//     }
//     leafHeaders.push(header)
//   }
//   recurseHeader(header)
//   return leafHeaders
// }

// 触发排序
const handleSortChange = async ({ sort, trigger, sortConfig, id, getIsSorted, resetSorting, toggleSorting, sortChange }) => {
  if (!sort) return;
  if (trigger === 'cell' && sortConfig.trigger !== 'cell') return;
  const sortState = getIsSorted();
  await sortState === 'desc' ? resetSorting() : toggleSorting(sortState);
  await sortChange?.({ id, order: getIsSorted() });
};

// 排序
const ColumnSort = (column) => {
  const { sortConfig, sortChange } = useContext(Context);
  const { sort, getToggleSortingProps, getIsSorted } = column;
  if (!sort) { return null };

  const sortClick = (e) => {
    e.stopPropagation();
    handleSortChange({ ...column, sortConfig, sortChange });
  };

  return (
    <>
      <div className="ck-column-sorter" {...getToggleSortingProps({ title: null, onClick: sortClick })}>
        <i className={cn('sort-asc', { 'sort-active': getIsSorted() === 'asc' })} />
        <i className={cn('sort-desc', { 'sort-active': getIsSorted() === 'desc' })} />
      </div>
    </>
  )
};

// 过滤
const ColumnFilter = (props) => {
  const { getColumnFilterValue, filterType, filterRender } = props;
  const { tableInstance: { render } } = useContext(Context);
  const filterClick = (e) => e.stopPropagation();
  const filterValue = getColumnFilterValue();

  const FilterControl = useMemo(() => {
    return render(() => filterRender ? filterRender(props) : builtInFilterType[filterType](props));
  }, []);

  return (
    <>
      <div className={cn('ck-column-filter', { 'filter-active': !!filterValue && filterValue.length })} onClick={filterClick}>
        <Dropdown trigger="click" placement="bottomRight" overlay={FilterControl}>
          <i className="iconfont icon-filter">&#xe8b3;</i>
        </Dropdown>
      </div>
    </>
  )
};

// 拖拽
const ColumnResize = ({ id, getResizerProps, getCanResize, getIsResizing, getLeafHeaders, getWidth }) => {
  const { tableInstance } = useContext(Context);
  const { setColumnSizing, setColumnSizingInfo } = tableInstance;
  const [left, setLeft] = useState(0);
  if (!getCanResize()) { return false };

  // 移动时获取的clientX - 点击时获取的clientX = 偏移的距离
  const handleResize = (props) => {
    const onResizeStart = (e) => {
      e.persist();
      e.preventDefault();

      const headerIdWidths = getLeafHeaders().map(d => [d.id, d.getWidth()]);

      const dispatchMove = clientXPos => { setLeft(clientXPos - e.clientX) };

      // 拖拽停止,拖拽条状态重置复原
      const dispatchEnd = () => { setLeft(0) };

      const updateOffset = (clientXPos) => {
        let newColumnSizing = {};
        setColumnSizingInfo(old => {
          const deltaOffset = clientXPos - (old?.startOffset ?? 0)
          const deltaPercentage = Math.max(
            deltaOffset / (old?.startSize ?? 0),
            -0.999999
          )

          old.columnSizingStart.forEach(([columnId, headerWidth]) => {
            newColumnSizing[columnId] =
              Math.round(
                Math.max(headerWidth + headerWidth * deltaPercentage, 0) *
                100
              ) / 100
          })

          return {
            ...old,
            deltaOffset,
            deltaPercentage,
            isResizingColumn: false,
          }
        })

        setColumnSizing(old => ({
          ...old,
          ...newColumnSizing,
        }))
      };

      // 监听移动事件，默认鼠标事件mouse，触碰事件touch未加
      const handlersAndEvents = {
        mouse: {
          moveEvent: 'mousemove',
          moveHandler: e => dispatchMove(e.clientX),
          upEvent: 'mouseup',
          upHandler: e => {
            document.removeEventListener(
              'mousemove',
              handlersAndEvents.mouse.moveHandler
            )
            document.removeEventListener(
              'mouseup',
              handlersAndEvents.mouse.upHandler
            )
            updateOffset(e.clientX);

            dispatchEnd();
          },
        },
      };

      document.addEventListener('mousemove',
        handlersAndEvents.mouse.moveHandler,
        false,
      )
      document.addEventListener('mouseup',
        handlersAndEvents.mouse.upHandler,
        false
      )

      setColumnSizingInfo(old => ({
        ...old,
        startOffset: e.clientX,
        startSize: getWidth(),
        deltaOffset: 0,
        deltaPercentage: 0,
        columnSizingStart: headerIdWidths,
        isResizingColumn: id,
      }))
    }

    return {
      ...props,
      onClick: (e) => e.stopPropagation(),
      onMouseDown: e => onResizeStart(e),
      style: { transform: `translateX(${left}px)` },
    }
  };

  return (
    <div {...getResizerProps(handleResize)} className={cn('ck-table-resize', { isResizing: getIsResizing() })}
    >
      <div className="resize-bar" />
    </div>
  )
};

// 列头单元格拓展区域
const HeaderCellExpand = (props) => {
  const { column } = props;
  const { resizable } = useContext(Context);
  const { sort, filters } = column;
  return (
    <>
      <div className='ck-column-expand'>
        {/* 列排序 */}
        {sort && <ColumnSort {...column} />}

        {/* 列过滤 */}
        {filters && <ColumnFilter {...column} />}

        {/* 列拖拽 */}
        {resizable && <ColumnResize {...props} {...column} />}
      </div>
    </>
  )
};

const HeaderCell = (props) => {
  const { renderHeader, column } = props;
  const { tableInstance } = useContext(Context);
  const { getToggleAllRowsSelectedProps } = tableInstance;
  const { type } = column;

  return (
    <>
      <div className="ck-cell">
        {type === 'checkbox' ? <CheckBox {...getToggleAllRowsSelectedProps()} /> : renderHeader()}
      </div>

      <HeaderCellExpand {...props} />
    </>
  );
};

const HeaderAllCell = ({ headers }) => {
  const { sortConfig, sortChange } = useContext(Context);

  // Th属性
  const getHeaderProps = (header) => {
    const { getHeaderProps, getWidth, column } = header;
    const { getIsPinned, getPinnedIndex } = column;

    const sty = () => {
      const fixed = getIsPinned();
      const obj = { width: getWidth(), position: getIsPinned() ? 'sticky' : 'relative' };
      if (fixed === 'left') {
        const totalLeft = headers.slice(0, getPinnedIndex()).reduce((sum, header) => {
          return sum + header.getWidth()
        }, 0) ?? 0;
        header.column.totalLeft = totalLeft;
        obj.left = totalLeft
      }
      if (fixed === 'right') {
        const totalRight = headers.slice(0, getPinnedIndex()).reduce((sum, header) => {
          return sum + header.getWidth()
        }, 0) ?? 0;
        header.column.totalRight = totalRight;
        obj.right = totalRight
      }
      if (fixed === 'right') {
        console.log('getPinnedIndex', column.accessorKey, getPinnedIndex())
        // obj.right = totalColumnsWidth - column.totalLeft - column.totalWidth;
      }
      return obj;
    };


    return {
      ...getHeaderProps(),
      className: cn("ck-th", { 'fixed-left': getIsPinned() === 'left', 'fixed-right': getIsPinned() === 'right' }),
      style: sty(),
      onClick: () => handleSortChange({ ...column, sortConfig, sortChange, trigger: 'cell' }),
    }
  };

  return headers.map((header) => (<div  {...getHeaderProps(header)}>
    <HeaderCell {...header} />
  </div>));
};
export default HeaderAllCell;
