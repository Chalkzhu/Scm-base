import { Dropdown } from 'antd';
import cn from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { IconFont } from '@/components';
import FilterComp from '../components/filterTypes';
import { useStore } from '../context';
import { getIsHas, render } from '../utils';

// 过滤菜单
const FilterMenu = (props) => {
  const { field, title, type = 'checkbox', data, props: comProps } = props;
  const { state, dispatch } = useStore();
  const [visible, setVisible] = useState(false);

  // 当前过滤的值
  const filterValue = useMemo(() => state.filterValues[field], [field, state.filterValues]);

  // 判断是否正在过滤
  const isFiltering = useMemo(() => getIsHas(filterValue), [filterValue]);

  // 设置过滤的内容 过滤类型filterType: 'single' 单个勾选时触发, 默认按钮触发
  const setFilterValue = useCallback((val, filterType) => {
    const nValue = { ...state.filterValues };
    getIsHas(val) ? (nValue[field] = val) : (delete nValue[field]);
    dispatch({ type: 'changeFilterValues', filterValues: nValue });

    // 触发外部查询, 单击时不关闭菜单
    state.instance.onChange?.(nValue);
    !filterType && setVisible(false);
  }, [dispatch, field, state.filterValues, state.instance]);

  // 展示的内容
  const checkedValue = useMemo(() => {
    // 日期类型
    if (type === 'date') {
      const obj = {
        props: comProps,
        getFilterValue: filterValue,
        setFilterValue,
      }
      return <FilterComp type="datePicker" {...obj} />;
    }
    // 不存在过滤时
    if (!isFiltering) return '全部';

    // 选择框类型 select & checkbox
    if (['select', 'checkbox'].includes(type)) {
      const findItem = data.find(v => Array.isArray(filterValue) ? filterValue.includes(v.value) : v.value === filterValue);
      if (!findItem) {
        setFilterValue(type === 'checkbox' ? [] : '')
        return '全部'
      }
      const filterLabel = findItem.label;
      if (Array.isArray(filterValue)) {
        return filterValue.length > 1 ? `${filterLabel}、+${filterValue.length - 1}...` : filterLabel;
      }
      return filterLabel;
    }
    // 输入框类型
    return filterValue;
  }, [comProps, data, isFiltering, setFilterValue, type, filterValue])

  // 下拉组件渲染
  const FilterControl = useCallback(() => {
    const obj = {
      filters: data,
      getFilterValue: filterValue,
      setFilterValue,
    }
    return render(() => <FilterComp type={type} {...obj} />)
  }, [data, filterValue, setFilterValue, type]);

  // 清除筛选项
  const handleClear = (e) => {
    if (isFiltering) {
      e.stopPropagation();
      setFilterValue(type === 'checkbox' ? [] : '')
    }
  };

  if (type === 'date') {
    return (
      <>
        <div className={cn('filter_item', { isfiltering: isFiltering, active: !isFiltering && visible })}>
          <div className='filter_item_label'>{title}:</div>
          <div className='filter_item_value'>
            <div className="checked">{checkedValue}</div>
          </div>
        </div>
      </>
    )
  };

  return (
    <>
      <Dropdown trigger={['click']} visible={visible} placement="bottomLeft" overlay={FilterControl} onVisibleChange={v => setVisible(v)}>
        <div className={cn('filter_item', { isfiltering: isFiltering, active: !isFiltering && visible })}>
          <div className='filter_item_label'>
            {title}:
          </div>
          <div className='filter_item_value'>
            <span className="checked">{checkedValue}</span>
            <IconFont type={isFiltering ? 'lmweb-close-circle-fill' : 'lmweb-down'} className="addonAfter" onClick={handleClear} />
          </div>
        </div>
      </Dropdown>
    </>
  );
}

export default FilterMenu;
