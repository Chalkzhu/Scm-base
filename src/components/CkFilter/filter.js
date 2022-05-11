import React, { useEffect } from 'react';
import { Context, useContent } from './context';
import Custom from './customFilter';
import BaseFilter from './baseFilter';
import ComplexFilter from './complexFilter';
import { getIsHas } from './utils';
import Group from './customFilter/radioGroup';
import CustomModal from './components/modal';

/*
 * data
 * 
*/
const Filter = (props) => {
  const [state, dispatch] = useContent();
  const { custom, levelGroup, complex } = state.instance;

  const handleGet = () => {
    console.log(state);
  }

  // 初始化过滤数据
  useEffect(() => {
    const { trigger, onChange, data, filterValues = {}, custom: hasCustom, levelGroup: hasLevelGroup } = props;
    const isMore = data?.length > 5;
    const visileData = data.filter(v => {
      v.fixed && getIsHas(v?.value) && (filterValues[v.field] = v.value);
      return v.fixed
    });

    const customFilterValues = () => {
      const nValue = hasCustom || hasLevelGroup;
      return nValue?.find(v => v.default)?.filterValues || {}
    }

    const options = {
      visibleFields: isMore ? visileData.map(v => v.field) : data.map(v => v.field),
      orderFields: data.sort((a, b) => !!b.fixed - !!a.fixed).map((v) => v.field),
      isMore,
      filterValues,
      customFilterValues: customFilterValues(),
    };
    dispatch({ type: 'initOptions', options });

    // 是否立即触发
    trigger === 'init' && onChange?.(filterValues, customFilterValues())
  }, []);

  useEffect(() => {
    dispatch({ type: 'initInstance', instance: props })
  }, [dispatch, props])

  return (
    <Context.Provider value={{ state, dispatch }}>
      <div className='filter_base'>
        {/* 自定义过滤数据: 一级过滤 */}
        {custom && <Custom />}
        {levelGroup && <Group />}

        {(custom || levelGroup) && <div className="line" />}

        {/* 基础过滤: 二级过滤 */}
        <BaseFilter />

        {/* 高级筛选: 二级筛选 */}
        {complex && <ComplexFilter />}

        <div onClick={handleGet}>获取内容</div>


        {/* 选项弹窗 */}
        <CustomModal />
      </div>
    </Context.Provider>
  )
};

export default Filter;
