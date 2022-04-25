import { Dropdown } from 'antd';
import cn from 'classnames';
import React, { useCallback, useState } from 'react';
import { IconFont } from '@/components';
import FilterComp from '../components/filterTypes';
import { useStore } from '../context';
import { getIsHas, render } from '../utils';

const MoreFilters = () => {
  const { state, dispatch } = useStore();
  const [visible, setVisible] = useState(false);

  const setFilterValue = useCallback((item, type) => {
    // 单选操作: 显隐/过滤
    if (!type) {
      // 是否显示, 取反
      const isVisible = state.visibleFields.includes(item.field);

      const nValue = isVisible
        ? state.visibleFields.filter((v) => v !== item.field)
        : [...state.visibleFields, item.field];

      dispatch({ type: 'changeVisibleFields', visibleFields: nValue });

      dispatch({
        type: 'changeOrderFields',
        orderFields: [...nValue, ...state.orderFields.filter(v => !nValue.includes(v))]
      });

      // 收起时，仅当存在筛选条件时, 才会触发筛选改变事件
      if (isVisible && getIsHas(state.filterValues[item.field])) {
        const filterValues = { ...state.filterValues };
        delete filterValues[item.field]
        dispatch({ type: 'changeFilterValues', filterValues })

        state.instance.onChange?.(filterValues); // 触发外部查询事件
      }
    };

    // 重置操作: 输入框的内容不重置
    if (type === 'reset') {
      const searchKey = state.instance.searchKey;
      const searchValue = state.filterValues[searchKey];
      const obj = state.originProps.filterValues || {};
      getIsHas(searchValue) ? (obj[searchKey] = searchValue) : (delete obj[searchKey]);

      const visileData = state.originProps.data.filter(v => {
        v.fixed && getIsHas(v?.value) && (obj[v.field] = v.value);
        return v.fixed
      });
      const options = {
        filterValues: obj,
        visibleFields: state.isMore ? visileData.map(v => v.field) : state.originProps.data.map(v => v.field),
        orderFields: state.originProps.data.sort((a, b) => !!b.fixed - !!a.fixed).map((v) => v.field),
      };

      dispatch({ type: 'initOptions', options });
      state.instance.onChange?.(obj); // 触发外部查询事件
    };

    if (type === 'top') {
      dispatch({
        type: 'changeOrderFields',
        orderFields: [item.field, ...state.orderFields.filter((v) => v !== item.field)]
      });
    };

    // 全选操作
    if (['show', 'hidden'].includes(type)) {
      const fixed = type === 'show';
      dispatch({
        type: 'changeVisibleFields',
        visibleFields: fixed ? item.map((v) => v.field) : []
      });

      // 收起时，仅当存在筛选条件时, 才会触发筛选改变事件
      if (!fixed && getIsHas(state.filterValues)) {
        const searchKey = state.instance.searchKey;
        const searchValue = state.filterValues[searchKey];

        const searchObj = { [searchKey]: searchValue };
        // 判断是否存在选中的筛选数据
        if (JSON.stringify(searchObj) !== JSON.stringify(state.filterValues)) {
          const obj = {};
          getIsHas(searchValue) && (obj[searchKey] = searchValue);
          dispatch({ type: 'changeFilterValues', filterValues: obj });
          state.instance.onChange?.(obj); // 触发外部查询事件
        }
      }
    };

    // 人性化设计,位置不变无需收起
    type !== 'top' && setVisible(false); // 收起下拉选项框
  }, [dispatch, state.filterValues, state.instance, state.isMore, state.orderFields, state.originProps.data, state.originProps.filterValues, state.visibleFields]);

  const FilterControl = useCallback(() => {
    const obj = {
      filters: state.instance.data?.sort(
        (a, b) => state.orderFields.indexOf(a.field) - state.orderFields.indexOf(b.field),
      ),
      getFilterValue: state.visibleFields,
      setFilterValue
    }
    return render(() => <FilterComp type="more" {...obj} />)
  }, [setFilterValue, state.instance.data, state.orderFields, state.visibleFields]);

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
