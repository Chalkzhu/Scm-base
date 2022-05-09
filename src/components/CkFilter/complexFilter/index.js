import cn from 'classnames';
import React, { useState, useMemo } from 'react';
import { IconFont } from '@/components';
import { useStore } from '../context';
import ComplexFilterDrawer from './drawer';
import { getIsHas } from '../utils';

const Custom = () => {
  const { state, dispatch } = useStore();
  const [visible, setVisible] = useState(false);

  // 是否正在高级筛选
  const isOnSearch = useMemo(() => {
    return getIsHas(state.complexFilterValues)
  }, [state.complexFilterValues])

  const handleClick = () => {
    dispatch({
      type: 'changeComplexDrawer',
      complexDrawer: { ...state.complexDrawer, visible: true },
    });
    setVisible(!visible);
  };

  return (
    <>
      <div className={cn('filter_item filter_item_more', { active: isOnSearch })} onClick={handleClick}>
        <div className='filter_item_value'>
          <IconFont type="lmweb-filter" className="addonBefore" />
          <span className="checked">高级查询</span>
        </div>
      </div>

      {/* 右侧抽屉弹窗 */}
      <ComplexFilterDrawer />
    </>
  )
};

export default Custom;
