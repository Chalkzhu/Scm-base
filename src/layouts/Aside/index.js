import React, { useState, createContext, useContext, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Drawer } from 'antd';
import routers from '@/routers/config';
import Sty from './aside.module.less';

const Context = createContext({});

// 二三级菜单
const SubMenu = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Context);
  const { setVisible } = dispatch;
  const { visible, router } = state;
  const onClose = () => {
    setVisible(false);
  };

  const nav = (item) => {
    console.log('item', item);
  };

  const config = useMemo(() => {
    return {
      visible,
      title: router.name,
      closable: false,
      width: 180,
      placement: 'left',
      contentWrapperStyle: { left: '60px' },
      className: Sty.submenu_wrapper,
      onClose,
    }
  }, [state])

  return (
    <Drawer {...config}>
      <div className={Sty.submenu}>
        {router.children?.map(item => {
          return <NavLink key={`menuitem${item.path}`} to={item.path} activeclassname="active" className={Sty.submenu_item} onClick={onClose}>
            <div className={Sty.item_label}>{item.name}</div>
            <div className={Sty.item_icon}>{item.icon}</div>
          </NavLink>
        })}
      </div>
    </Drawer>
  )
};

// 一级菜单
const RootMenu = () => {
  const navigate = useNavigate();
  const { dispatch, state } = useContext(Context);
  const { setVisible, setRouter } = dispatch;
  const { visible } = state;

  const openSubmenu = (item) => {
    if (!item.children) {
      navigate(item.path);
      return;
    }
    !visible && setVisible(true);
    setRouter(item);
  }

  return (
    <ul className={Sty.rootmenu}>
      {
        routers.map(item => {
          return (
            !item.hidden && <li key={item.path}>
              <div className={Sty.rootmenu_item} onClick={() => openSubmenu(item)}>
                <div className={Sty.item_icon}>{item.icon}</div>
                <div className={Sty.item_label}>{item.name}</div>
              </div>
            </li>
          )
        })
      }
    </ul>
  )
}

const Side = () => {
  const [visible, setVisible] = useState(false);
  const [router, setRouter] = useState(false);
  const defaultProps = {
    state: {
      visible,
      router
    },
    dispatch: {
      setVisible,
      setRouter
    }
  }

  return (
    <Context.Provider value={defaultProps}>
      <aside className={Sty.main_side}>
        <div className={Sty.logo_wrapper}>
          <div className={Sty.logo}>LOGO</div>
        </div>

        <div className={Sty.aside_wrapper}>
          <RootMenu />
          <SubMenu />
        </div>

        <div className={Sty.plugin}>
          <div className={Sty.icon} title="这里是插件市场">Plugin</div>
        </div>
      </aside>
    </Context.Provider>
  )
};

export default Side;
