import React, { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons'
import Sty from './header.module.less';

const Header = (props) => {
  const [active, setActive] = useState('home');

  const handleClick = (item) => {
    setActive(item);
  };

  return (
    <header>
      <div className={Sty.tags}>
        <div className={`${Sty.tags_item} ${Sty.item_home} ${active === 'home' ? Sty.active : ''}`} onClick={() => handleClick('home')}>
          <div className={Sty.item_label}>首页</div>
        </div>
        {
          [1, 2, 3, 4, 5].map(item => {
            return (
              <div key={item} className={`${Sty.tags_item} ${active === item ? Sty.active : ''}`} onClick={() => handleClick(item)}>
                <div className={Sty.item_label}>标签{item}</div>
                <div className={Sty.item_close}><CloseOutlined /></div>
              </div>
            )
          })
        }
      </div>
      <div className={Sty.avatar}>
        Avatar
      </div>
    </header>
  )
}

export default Header;
