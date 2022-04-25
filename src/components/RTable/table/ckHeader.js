import React, { useContext, useEffect, useRef } from 'react';
import Context from '../context';
import HeaderCell from './ckHeaderCell';

// 列头
const Header = () => {
  const theadRef = useRef(null);
  const { dispatch, tableInstance } = useContext(Context);
  const { getHeaderGroups, getTableWidth } = tableInstance;

  useEffect(() => {
    if (theadRef) { dispatch({ type: 'headerElem', headerElem: theadRef }) }
  }, []);


  // Tr属性
  const getHeaderGroupProps = (headerGroup) => {
    return {
      ...headerGroup.getHeaderGroupProps(),
      style: { width: getTableWidth() },
    }
  };

  return (
    <>
      <div className="ck-header">
        <div ref={theadRef} className="ck-thead">
          {getHeaderGroups().map((headerGroup) => {
            return (
              <div className="ck-tr" {...getHeaderGroupProps(headerGroup)}>
                <HeaderCell {...headerGroup} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Header;
