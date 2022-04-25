import IconFont from '@/components/IconFont';
import { Dropdown } from 'antd';
import cn from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import FilterComp from '../components/filterTypes';
import { useStore } from '../context';
import { getIsHas, render } from '../utils';

// 过滤菜单
const FilterMenu = (props) => {
  const { field, title, type = 'checkbox', data, value, props: comProps } = props;
  const { state, dispatch } = useStore();
  const [visible, setVisible] = useState(false);

  // 判断是否正在过滤
  const isFiltering = useMemo(() => getIsHas(value), [value]);

  // 设置过滤的内容 type: 'single' 单个勾选时触发, 默认按钮触发
  const setFilterValue = useCallback((val, type) => {
    const instance = {
      ...state.instance,
      data: state.instance.data.map(v => {
        const obj = { ...v };
        if (obj.field === field) {
          obj.value = val;
        }
        return obj;
      })
    };
    const nValue = { ...state.filterValues };
    getIsHas(val) ? (nValue[field] = val) : (delete nValue[field]);
    dispatch({ type: 'changeFilterValue', filterValues: nValue });
    dispatch({ type: 'changeInstance', instance });

    // 触发外部查询
    state.instance.onChange(nValue);
    !type && setVisible(false);
  }, [dispatch, field, state.filterValues, state.instance]);

  // 展示的内容
  const checkedValue = useMemo(() => {
    if (type === 'date') {
      const obj = {
        props: comProps,
        getFilterValue: value,
        setFilterValue,
      }
      return <FilterComp type="datePicker" {...obj} />;
    }
    if (!isFiltering) return '全部';

    // select & checkbox
    const findItem = data.find(v => typeof value === 'string' ? value === v.value : value.includes(v.value));
    if (!findItem) {
      setFilterValue(type === 'checkbox' ? [] : '')
      return '全部'
    }
    const filterLabel = findItem.label;
    if (Array.isArray(value)) {
      if (value.length > 1) {
        return `${filterLabel}、+${value.length - 1}...`;
      }
      return filterLabel;
    }
    return filterLabel;
  }, [comProps, data, isFiltering, setFilterValue, type, value])

  // 下拉组件渲染
  const FilterControl = useCallback(() => {
    const obj = {
      filters: data,
      getFilterValue: value,
      setFilterValue,
    }
    return render(() => <FilterComp type={type} {...obj} />)
  }, [data, setFilterValue, type, value]);

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
          <div className='filter_item_label'>
            {title}:
          </div>
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