import React, { useMemo, useContext } from 'react';
import cn from 'classnames';
import Checkbox from '../components/Checkbox';
import Context from '../context';

const Cell = ({ cell, style }) => {
  const { tableInstance } = useContext(Context);
  const { totalColumnsWidth } = tableInstance;
  const { row, column, render, value } = cell;
  const sty = useMemo(() => {
    const obj = { ...style };
    if (column.fixed === 'left') {
      obj.left = column.totalLeft;
    }
    if (column.fixed === 'right') {
      obj.right = totalColumnsWidth - column.totalLeft - column.totalWidth;
    }
    if (column.align) {
      obj.textAlign = column.align;
    }
    if (column.maxWidth < 2000) {
      obj.maxWidth = column.maxWidth;
    }
    return obj
  }, [totalColumnsWidth, column, style]);

  return (
    <div className={cn('ck-td', { [`fixed-${column.fixed}`]: !!column.fixed, ellipsis: column.ellipsis })} style={sty}>
      <div className="ck-cell" title={column.ellipsis ? value : null}>
        {column.type === 'checkbox' ? <Checkbox {...row.getToggleRowSelectedProps()} /> : column.type === 'seq' ? render(() => column?.Cell(row.original, cell.row.index + 1) || cell.row.index + 1) : render(() => column?.Cell(row.original, value) || value)}
      </div>
    </div>
  );
};

export default Cell;
