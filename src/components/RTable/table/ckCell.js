import React, { useState, useEffect, useRef, useMemo, useContext, useCallback } from 'react';
import { Tooltip } from 'antd';
import cn from 'classnames';
import Checkbox from '../components/Checkbox';
import Context from '../context';

const Cell = (props) => {
  const { showOverflow } = useContext(Context);
  const ellipsisRef = useRef(null);
  const [isTooltip, setIsTooltip] = useState(false)
  const { row, column, renderCell, value } = props;
  const { type, ellipsis, columnDef } = column;

  // title原生提示
  const overflowTitle = useMemo(() => {
    const isHidden = typeof ellipsis === 'boolean' && !ellipsis;
    const showTitle = ellipsis === 'title' || showOverflow === 'title';
    return !isHidden && showTitle;
  }, [ellipsis, showOverflow]);

  // Tooltip提示
  const overflowTooltip = useMemo(() => {
    const isHidden = typeof ellipsis === 'boolean' && !ellipsis;
    const showTooltip = ellipsis === 'tooltip' || showOverflow === 'tooltip';
    return !isHidden && showTooltip;
  }, [ellipsis, showOverflow]);

  // 展示的内容
  const EllipsisValue = useCallback(() => {
    switch (type) {
      case 'checkbox':
        return <Checkbox {...row.getToggleSelectedProps()} />;
      case 'seq':
        return columnDef?.cell ? renderCell() : row.index + 1;

      default:
        break;
    }
    return columnDef?.cell ? renderCell() : <span title={!overflowTooltip && overflowTitle ? value : null}>{value}</span>;
  }, [props]);

  useEffect(() => {
    if (overflowTooltip && ellipsisRef.current) {
      const { scrollWidth, clientWidth } = ellipsisRef.current;
      setIsTooltip(scrollWidth > clientWidth)
    }
  }, [props])

  if (isTooltip) {
    return (
      <Tooltip title={columnDef?.cell ? renderCell() : value} destroyTooltipOnHide={{ keepParent: false }}>
        <div ref={ellipsisRef} className="ck-cell">
          <EllipsisValue />
        </div>
      </Tooltip>
    );
  }

  return (
    <div ref={ellipsisRef} className="ck-cell">
      <EllipsisValue />
    </div>
  );
};

const CellWrapper = (props) => {
  const { column: { minWidth, maxWidth, align, ellipsis, totalLeft = 0, totalRight = 0, getWidth, getIsPinned }, style } = props;

  const sty = useMemo(() => {
    const fixed = getIsPinned();
    const obj = { ...style, width: getWidth(), minWidth: minWidth, position: fixed ? 'sticky' : 'relative' };
    if (align) {
      obj.textAlign = align;
    }
    if (fixed === 'left') {
      obj.left = totalLeft;
    }
    if (fixed === 'right') {
      obj.right = totalRight;
    }
    if (maxWidth < 2000) {
      obj.maxWidth = maxWidth;
    }
    return obj
  }, [props]);

  return (
    <div className={cn('ck-td', { ellipsis: !!ellipsis, 'fixed-left': getIsPinned() === 'left', 'fixed-right': getIsPinned() === 'right' })} style={sty}>
      <Cell {...props} />
    </div>
  );
};

export default CellWrapper;
