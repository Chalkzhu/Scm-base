import React, { useContext } from 'react';
import { Checkbox, Dropdown, Button } from 'antd';
import Context from '../context';
import { swapArr } from '../utils';

const Setting = () => {
  const { tableInstance } = useContext(Context);
  const { getAllColumns, getIsAllColumnsVisible, getIsSomeColumnsVisible, toggleAllColumnsVisible, setColumnVisibility, setColumnOrder, render } = tableInstance;
  const columns = getAllColumns();

  const handleChange = (item) => item.toggleVisibility(!item.getIsVisible());

  const handleAllChange = () => toggleAllColumnsVisible?.();

  // 列重置
  const handleReset = () => {
    // 接收默认隐藏的列字段
    const obj = {};
    columns.forEach(v => {
      if (typeof v.visible === 'boolean' && !v.visible) { obj[v.id] = v.visible }
    });
    setColumnVisibility(obj)
  };

  // 设为固定列
  const handleFixed = (field, position = 'right') => {
    const currentItem = columns.splice(columns.findIndex(v => v.id === field), 1)[0];
    currentItem.fixed = position
    columns.push(currentItem);
    setColumnOrder(columns.map(d => d.id));
  };

  return (
    <div className="ck-table-setting-dropdown">
      <div className="ck-table-setting-header" />
      <div className="ck-table-setting-body">
        <div className="ck-table-setting-reset">
          <Checkbox checked={getIsAllColumnsVisible()} indeterminate={!getIsAllColumnsVisible() && getIsSomeColumnsVisible()} onChange={handleAllChange} className="ck-table-setting-item-content">全选</Checkbox>

          <div><Button type="link" size="small" onClick={handleReset}>重置</Button></div>
        </div>
        <ul className="ck-table-setting-list">
          {
            columns.map((item, i) => {
              return (
                <li key={item.id || i} className="ck-table-setting-item">
                  <Checkbox checked={item.getIsVisible()} onChange={() => handleChange(item)} className="ck-table-setting-item-content">{item.columnDef.header ? typeof item?.header === 'function' ? render(() => item.header()) : item?.header : null}</Checkbox>
                  <div onClick={() => item.pin('left')}>👈</div>
                  <div onClick={() => item.pin('right')}>👉</div>
                </li>
              )
            })
          }
        </ul>
      </div>
      <div className="ck-table-setting-footer" />
    </div>
  )
};

const Wrapper = () => {
  return (
    <Dropdown trigger="click" placement="bottomRight" overlay={<Setting />}>
      <i className="iconfont icon-setting">&#xe78e;</i>
    </Dropdown>
  )
};

export default Wrapper;