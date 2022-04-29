import cn from 'classnames';
import React, { useCallback, useState } from 'react';
import { IconFont } from '@/components';

const Custom = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div className={cn('filter_item filter_item_more', { active: visible })} onClick={() => setVisible(!visible)}>
        <div className='filter_item_value'>
          <IconFont type="lmweb-filter" className="addonBefore" />
          <span className="checked">高级查询</span>
        </div>
      </div>
    </>
  )
};

export default Custom;
