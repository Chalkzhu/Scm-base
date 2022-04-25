import React, { useMemo, useContext } from 'react';
import cn from 'classnames';
import Context from '../context';
import CkCell from './ckCell';

const Row2 = ({ getVisibleCells, isSelected, getRowProps, style }) => {
  const { checkboxConfig } = useContext(Context);
  return (
    <div className={cn('ck-tr', { 'row-checked': checkboxConfig.highlight && isSelected })} {...getRowProps({ style })}>
      {getVisibleCells().map((cell) => {
        return <CkCell {...cell} {...cell.getCellProps()} />
      })}
    </div>
  );
};

const Row = ({ index, start }) => {
  const { tableInstance, checkboxConfig } = useContext(Context);
  const { getRowModel } = tableInstance;

  const { getVisibleCells, isSelected, getRowProps } = getRowModel().rows[index];

  const style = useMemo(() => ({
    position: "absolute",
    top: 0,
    left: 0,
    minWidth: '100%',
    transform: `translateY(${start}px)`,
  }), [start])

  const trAttr = {
    className: cn('ck-tr', { 'row-checked': checkboxConfig.highlight && isSelected }),
    ...getRowProps({ style })
  }

  return (
    <div {...trAttr}>
      {getVisibleCells().map((cell) => {
        return <CkCell {...cell} {...cell.getCellProps()} />
      })}
    </div>
  );
};

export default Row;
