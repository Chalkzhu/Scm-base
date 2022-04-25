import React, { useContext, useRef, useEffect, useMemo } from 'react';
import cn from 'classnames';
import { useVirtual } from "react-virtual";
import Context from '../context';
import CkRow from './ckRow';

const Body = () => {
  const bodyRef = useRef();
  const { dispatch, state, tableInstance, showOverflow, size = 'small', stripe, rowConfig } = useContext(Context);
  const { getTableBodyProps, getRowModel } = tableInstance;

  const { totalSize, virtualItems } = useVirtual({
    size: getRowModel().rows.length,
    parentRef: bodyRef,
    estimateSize: React.useCallback(() => {
      const sizes = { large: 64, small: 48, mini: 36 }
      return sizes[size];
    }, [size]),
    overscan: 2
  });

  const onScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    if (scrollLeft !== state.curScroll.scrollLeft) {
      if (state.headerElem) { state.headerElem.current.scrollLeft = scrollLeft };
      if (state.footerElem) { state.footerElem.current.scrollLeft = scrollLeft };
    }

    dispatch({
      type: 'changeScroll',
      curScroll: { scrollLeft, scrollWidth, clientWidth },
    });
  };

  const virScrollStyles = useMemo(() => {
    return {
      height: `${totalSize}px`,
      width: "100%",
      position: "relative"
    }
  }, [totalSize]);

  useEffect(() => {
    if (bodyRef) {
      dispatch({ type: 'bodyElem', bodyElem: bodyRef });
    };
  }, []);

  return (
    <>
      <div className={cn('ck-body', { ellipsis: !!showOverflow, 'row-hover': rowConfig.isHover, stripe })} {...getTableBodyProps()}>
        <div ref={bodyRef} className='ck-tbody' onScroll={onScroll}>
          <div style={virScrollStyles}>
            {virtualItems.map(virtualRow => {
              return <CkRow key={virtualRow.index} {...virtualRow} />
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Body;
