import React, { useState, useMemo } from 'react';
import { Button, Drawer, Form, Input, Space, Radio, Tag } from 'antd';
import { IconFont, VirtualList } from '@/components';
import { useStore } from '../context';
import { getIsHas } from '../utils';

// 选中的筛选项
const ListItemChecked = (props) => {
  const { state, dispatch } = useStore();
  const { instance: { fullData = [] }, complexDrawer: { data } } = state;
  const { field, value } = props;

  // 单项匹配数据, 根据字段名查找
  const getItem = useMemo(() => fullData.find(v => v.field === field), [field, fullData]);

  // 选中的数据
  const checkedValues = useMemo(() => {
    const checkedValue = value.value;
    if (Array.isArray(checkedValue)) {
      return getItem.data.filter(v => checkedValue.includes(v.value));
    }
    const filterValue = getItem.data.find(v => v.value === checkedValue);
    return filterValue ? [filterValue] : [];
  }, [getItem.data, value]);

  // 新增
  const handleAdd = () => { };

  // 编辑
  const handleEdit = () => {
    dispatch({
      type: 'changeModal',
      customModal: { visible: true, type: 'complex', data: { ...getItem, ...value } }
    })
  };

  // 删除
  const handleDelete = (e) => {
    e.stopPropagation();
    const filterValues = { ...data };
    delete filterValues[field];
    dispatch({ type: 'changeComplexDrawer', complexDrawer: { visible: true, data: filterValues } });
  };

  // 删除Tag
  const onTagClose = (val) => {
    const filterValues = {
      ...data,
      [field]: {
        ...data[field],
        value: data[field].value.filter(v => !v.includes(val))
      }
    };
    dispatch({ type: 'changeComplexDrawer', complexDrawer: { visible: true, data: filterValues } });
  };

  // Tags显示
  const tagElem = () => {
    return (
      <>
        {checkedValues?.map((v) => (
          <Tag key={v.value} closable onClose={() => onTagClose(v.value)}>
            {v.label}
          </Tag>
        ))}

        <Tag className="site-tag-plus" onClick={handleAdd}>
          <IconFont type="lmweb-plus-circle" /> 新增
        </Tag>
      </>
    );
  };

  // 模式
  const modeLabel = useMemo(() => value.mode === 'and' ? '且' : '或', [value.mode]);

  return (
    <>
      <div className="item_box" onClick={handleEdit}>
        <div className="item_header">
          <div className="item_header_title">
            {`${getItem.title}（${modeLabel}）`}
          </div>
          <IconFont type="lmweb-close1" onClick={handleDelete} className="item_header_icon" />
        </div>
        <div className="item_tags">{tagElem()}</div>
      </div>
    </>
  );
};

// 全部筛选项
const ListGroup = () => {
  const { state } = useStore();
  const { fullData } = state.instance;
  const [options, setOptions] = useState(fullData);

  const handleSearch = (val) => {
    setOptions(fullData.filter(v => v.title.indexOf(val) > -1));
  };
  // 编辑
  const handleEdit = () => { };

  return (
    <>
      <div className="list_group">
        <div className="list_group_title">选择查询项</div>
        <div className="list_group_search">
          <Input.Search allowClear size="default" placeholder="请输入" onSearch={handleSearch} />
        </div>
        <VirtualList options={options} className="filter_drawer_group_list">
          {({ item, ...resetProps }) => {
            return (
              <div {...resetProps} className="filter_drawer_group_item">
                <div className="item_box" onClick={handleEdit}>
                  <div className="item_header">
                    <div className="item_header_title">
                      {item.title}
                    </div>
                    <IconFont type="lmweb-plus" className="item_header_icon icon_plus" />
                  </div>
                </div>
              </div>
            )
          }}
        </VirtualList>
      </div>
    </>
  )
}

const Index = () => {
  const { state, dispatch } = useStore();
  const { complexDrawer: { visible, data } } = state;

  const isHas = useMemo(() => getIsHas(data), [data]);

  // 过滤的内容转数组
  const filterItemData = useMemo(() => {
    return isHas ? Object.entries(data).map(v => ({ field: v[0], value: v[1] })) : [];
  }, [data, isHas]);
  console.log('filterItemData', filterItemData);

  const onClose = () => { dispatch({ type: 'changeComplexDrawer', complexDrawer: { data, visible: false } }) };
  const onSave = () => { };
  const onSearch = () => {
    console.log('complexDrawer:', data);
  };


  // 弹窗配置项
  const config = {
    title: '高级查询',
    visible,
    onClose,
    width: 440,
    placement: "right",
    destroyOnClose: true,
    className: "filter_drawer",
    extra: (
      <Space>
        <Button onClick={onClose} size="small">取消</Button>
        <Button onClick={onSave} size="small">
          保存查询
        </Button>
        <Button type="primary" onClick={onSearch} size="small">
          查询
        </Button>
      </Space>
    )
  };

  return (
    <>
      <Drawer {...config}>
        <div className="complex_filter_body">

          {/* 选中的筛选项 */}
          {isHas && (
            <div className="checked_group">
              <VirtualList options={filterItemData} className="filter_drawer_group_list">
                {({ item, ...resetProps }) => {
                  return (
                    <div {...resetProps} className="filter_drawer_group_item">
                      <ListItemChecked {...item} />
                    </div>
                  )
                }}
              </VirtualList>
            </div>
          )}

          {/* 所有的筛选项 */}
          <ListGroup />

        </div>
      </Drawer>
    </>
  )
};

export default Index;
