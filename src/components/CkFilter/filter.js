import React, { useEffect } from 'react';
import { Context, useContent } from './context';
import BaseFilter from './baseFilter';

/*
 * data
 * 
*/
const Filter = (props) => {
  const [state, dispatch] = useContent();

  const handleGet = () => {
    console.log(state);
  }

  useEffect(() => {
    dispatch({ type: 'initInstance', instance: props })
  }, [dispatch, props])

  return (
    <Context.Provider value={{ state, dispatch }}>
      {/* 基础过滤 */}
      <BaseFilter />

      <div onClick={handleGet}>获取内容</div>
    </Context.Provider>
  )
};

export default Filter;
