import React, { useEffect } from 'react';
import { Context, useContent } from './context';
import Custom from './customFilter';
import BaseFilter from './baseFilter';
import ComplexFilter from './complexFilter';
import { getIsHas } from './utils';

/*
 * data
 * 
*/
const Filter = (props) => {
  const [state, dispatch] = useContent();

  const handleGet = () => {
    console.log(state);
  }

  // 初始化过滤数据
  useEffect(() => {
    const { data, filterValues = {} } = props;
    const isMore = data?.length > 5;
    const visileData = data.filter(v => {
      v.fixed && getIsHas(v?.value) && (filterValues[v.field] = v.value);
      return v.fixed
    });
    const options = {
      filterValues,
      visibleFields: isMore ? visileData.map(v => v.field) : data.map(v => v.field),
      orderFields: data.sort((a, b) => !!b.fixed - !!a.fixed).map((v) => v.field),
      isMore,
    };
    dispatch({ type: 'initOptions', options });
  }, []);

  useEffect(() => {
    dispatch({ type: 'initInstance', instance: props })
  }, [dispatch, props])

  return (
    <Context.Provider value={{ state, dispatch }}>
      <div className='filter_base'>
        {/* 自定义过滤数据: 一级过滤 */}
        <Custom />

        {/* 基础过滤: 二级过滤 */}
        <BaseFilter />

        {/* 高级筛选: 二级筛选 */}
        {state.instance.complex && <ComplexFilter />}

        <div onClick={handleGet}>获取内容</div>
      </div>
    </Context.Provider>
  )
};

export default Filter;
