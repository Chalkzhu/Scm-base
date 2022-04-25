import React, { useRef, useMemo } from 'react';
import { useVirtual } from "react-virtual";

export const VirList = ({ options = [], children, size = 32, parentRef }) => {
  const bodyRef = useRef(null);

  const { totalSize, virtualItems } = useVirtual({
    size: options.length,
    parentRef: parentRef || bodyRef,
    estimateSize: React.useCallback(() => size, [size]),
    overscan: 2
  });

  const virScrollStyles = useMemo(() => ({ height: `${totalSize}px`, width: "100%", position: "relative" }), [totalSize]);

  if (options?.length < 50) {
    return (
      <div className="filter_list">
        {options?.map((item, i) => children({ key: i, item }))}
      </div>
    )
  };

  return (
    <>
      <div ref={bodyRef} className="filter_list">
        <div style={virScrollStyles}>
          {virtualItems.map(virtualRow => {
            const style = {
              position: "absolute",
              top: 0,
              left: 0,
              minWidth: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }
            return children({ key: virtualRow.index, item: options[virtualRow.index], style })
          })}
        </div>
      </div>
    </>
  );
};
