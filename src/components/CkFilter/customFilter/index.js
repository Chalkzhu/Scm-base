import React, { useState, useMemo, useCallback } from 'react';
import { Dropdown } from 'antd';
import cn from 'classnames';
import { IconFont } from '@/components';
import FilterComp from '../components/filterTypes';
import { useStore } from '../context';
import { getIsHas, render } from '../utils';
import CustomFilterDrawer from './drawer';
import CustomModal from './modal';

const Custom = () => {
  const { state, dispatch } = useStore();
  const [visible, setVisible] = useState(false); // 下拉框的显隐
  const [checkValue, setCheckValue] = useState('all'); // 选中的数据

  // 选中的项
  const filterItem = useMemo(() => {
    return state.instance.custom?.find(v => v.value === checkValue);
  }, [checkValue, state.instance.custom]);

  // 设置过滤的内容
  const setFilterValue = useCallback((item, type) => {
    if (!type) {
      setVisible(false);
      setCheckValue(item.value); // 设置选中的值
      dispatch({
        type: 'changeCustomFilterValues',
        customFilterValues: item.filterValues
      });
      // 向外抛出一级查询条件: 二级筛选, 一级筛选
      state.instance.onChange?.(state.filterValues, item.filterValues);
    }

    if (['add', 'edit'].includes(type)) {
      const isEdit = type === 'edit';
      dispatch({ type: 'changeDrawer', customDrawer: { visible: true, data: isEdit ? item : {} } });
      setVisible(false);
    }

  }, [dispatch, state.filterValues, state.instance]);

  // 下拉组件渲染
  const FilterControl = useCallback(() => {
    const obj = {
      filters: state.instance.custom,
      getFilterValue: checkValue,
      setFilterValue,
    }
    return render(() => <FilterComp type="custom" {...obj} />)
  }, [checkValue, setFilterValue, state.instance.custom]);

  return (
    <>
      <Dropdown trigger={['click']} visible={visible} placement="bottomLeft" overlay={FilterControl} onVisibleChange={v => setVisible(v)}>
        <div className={cn('filter_custom', { active: visible })}>
          <div className="custom_label">
            <span className={cn({ 'custom_placeholder': filterItem.value === 'all' })}>
              {filterItem.label}
            </span>
          </div>

          <div className="custom_icon">
            <IconFont type="lmweb-down" />
          </div>
        </div>
      </Dropdown>

      {/* 右侧抽屉弹窗 */}
      <CustomFilterDrawer />

      {/* 选项弹窗 */}
      <CustomModal />
    </>
  )
};

export default Custom;
