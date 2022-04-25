import React, { useContext } from 'react';
import Context from '../context';
import CkCell from './ckCell';
import cn from 'classnames';

const Row = ({ row, style }) => {
  const { checkboxConfig } = useContext(Context);
  return (
    <div className={cn('ck-tr', { 'row-checked': checkboxConfig.highlight && row.isSelected })} style={style}>
      {row.cells.map((cell) => {
        return <CkCell cell={cell} {...cell.getCellProps()} />
      })}
    </div>
  );
};

export default Row;
