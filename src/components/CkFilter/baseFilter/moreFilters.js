import IconFont from '@/components/IconFont';
import { Dropdown } from 'antd';
import cn from 'classnames';
import React, { useCallback, useState } from 'react';
import FilterComp from '../components/filterTypes';
import { useStore } from '../context';
import { getIsHas, render } from '../utils';

const MoreFilters = () => {
  const { state, dispatch } = useStore();
  const [visible, setVisible] = useState(false);

  const setFilterValue = useCallback((item, type) => {
    // 单选操作
    if (!type) {
      const instance = {
        ...state.instance,
        data: state.instance.data.map(v => {
          const obj = { ...v };
          if (item.field === obj.field) {
            obj.fixed = !item.fixed;
            obj.value = '';
          }
          return obj;
        }),
      };
      dispatch({ type: 'changeInstance', instance })

      // 收起时，仅当存在筛选条件时, 才会触发筛选改变事件
      if (item.fixed && getIsHas(item.value)) {
        const nValue = { ...state.filterValues };
        delete nValue[item.field]
        dispatch({ type: 'changeFilterValue', filterValues: nValue })

        state.instance.onChange(nValue); // 触发外部查询事件
      }
    };

    // 重置操作: 输入框的内容不重置
    if (type === 'reset') {
      const searchKey = state.instance.searchKey;
      const searchValue = state.filterValues[searchKey];
      const obj = { ...state.originProps.filterValues };
      getIsHas(searchValue) ? (obj[searchKey] = searchValue) : (delete obj[searchKey]);
      state.originProps.data.forEach(v => { v.fixed && v?.value && (obj[v.field] = v.value) });
      dispatch({ type: 'changeInstance', instance: state.originProps });
      dispatch({ type: 'changeFilterValue', filterValues: obj });
      state.instance.onChange(obj); // 触发外部查询事件
    };

    if (type === 'top') {
      const nValue = [item, ...state.instance.data.filter(v => v.field !== item.field)];
      const instance = { ...state.instance, data: nValue };
      dispatch({ type: 'changeInstance', instance })
    };

    // 全选操作
    if (['show', 'hidden'].includes(type)) {
      const fixed = type === 'show';
      const nValue = {
        ...state.instance,
        data: item.map(v => {
          const obj = { ...v, fixed };
          if (!v.fixed) { obj.value = '' };
          return obj;
        })
      }
      dispatch({ type: 'changeInstance', instance: nValue });

      // 收起时，仅当存在筛选条件时, 才会触发筛选改变事件
      if (!fixed && getIsHas(state.filterValues)) {
        const searchKey = state.instance.searchKey;
        const searchValue = state.filterValues[searchKey];

        const searchObj = { [searchKey]: searchValue };
        // 判断是否存在选中的筛选数据
        if (JSON.stringify(searchObj) !== JSON.stringify(state.filterValues)) {
          const obj = {};
          getIsHas(searchValue) && (obj[searchKey] = searchValue);
          dispatch({ type: 'changeFilterValue', filterValues: obj });
          state.instance.onChange(obj); // 触发外部查询事件
        }
      }
    };

    // 人性化设计,位置不变无需收起
    type !== 'top' && setVisible(false); // 收起下拉选项框
  }, [dispatch, state.filterValues, state.instance, state.originProps]);

  const FilterControl = useCallback(() => {
    const obj = { filters: state.instance.data, setFilterValue }
    return render(() => <FilterComp type="more" {...obj} />)
  }, [setFilterValue, state.instance.data]);

  return (
    <>
      <Dropdown trigger={['click']} visible={visible} placement="bottomLeft" overlay={FilterControl} onVisibleChange={v => setVisible(v)}>
        <div className={cn('filter_item filter_item_more', { active: visible })} onClick={() => setVisible(!visible)}>
          <div className='filter_item_value'>
            <IconFont type="lmweb-plus-circle" className="addonBefore" />
            <span className="checked">更多查询</span>
            <IconFont type="lmweb-down" className="addonAfter" />
          </div>
        </div>
      </Dropdown>
    </>
  )
};

export default MoreFilters;
