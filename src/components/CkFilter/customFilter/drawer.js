import React, { useRef, useMemo } from 'react';
import { Button, Drawer, Input, Space, Radio, Tag } from 'antd';
import { IconFont, VirtualList } from '@/components';
import { useStore } from '../context';
import { getIsHas } from '../utils';

const ListItem = (props) => {
  const { state, dispatch } = useStore();
  const { instance: { fullData = [] } } = state;
  const { field, value } = props;
  // const [useCheckValue, setCheckValue] = useState(value); // 选中的数据

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
      customModal: { visible: true, data: { ...getItem, ...value } }
    })
  };

  const handleDelete = (e) => {
    e.stopPropagation();
  };

  // 删除Tag
  const onTagClose = () => { };

  // Tags显示
  const tagElem = () => {
    return (
      <>
        {checkedValues?.map((v) => {
          return (
            <Tag key={v.value} closable onClose={() => onTagClose(v.value)}>
              {v.label}
            </Tag>
          );
        })}

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
            {getItem.title}（{modeLabel}）
          </div>
          <IconFont type="lmweb-close1" onClick={handleDelete} className="item_header_icon" />
        </div>
        <div className="item_tags">{tagElem()}</div>
      </div>
    </>
  );
};

const Index = () => {
  const { state, dispatch } = useStore();
  const { customDrawer } = state;

  const inputRef = useRef();

  // 是否编辑
  const isEdit = useMemo(() => getIsHas(customDrawer.data), [customDrawer.data]);

  // 当前选中项
  const filterItem = useMemo(() => customDrawer.data, [customDrawer.data]);

  // 过滤的内容转数组
  const filterItemData = useMemo(() => {
    return getIsHas(filterItem?.filterValues) ? Object.entries(filterItem.filterValues).map(v => ({ field: v[0], value: v[1] })) : [];
  }, [filterItem]);

  // 关闭抽屉
  const onClose = () => { dispatch({ type: 'changeDrawer', customDrawer: { ...customDrawer, visible: false } }) };

  // 设为默认事件
  const onRadioChange = (e) => { const v = e.target.value };

  // 新增筛选项
  const addEvent = () => {
    dispatch({ type: 'changeModal', customModal: { visible: true, data: {} } });
  };

  // 保存数据
  const onSave = () => {
    console.log('保存数据！', state.customDrawer)
    onClose?.()
  };

  // 弹窗配置项
  const config = {
    title: isEdit ? '编辑自定义' : "创建自定义查询",
    visible: customDrawer.visible,
    onClose,
    width: 440,
    placement: "right",
    destroyOnClose: true,
    className: "filter_drawer",
    extra: (
      <Space>
        <Button onClick={onClose} size="small">取消</Button>
        <Button type="primary" onClick={onSave} size="small">
          创建
        </Button>
      </Space>
    )
  };

  return (
    <>
      <Drawer {...config}>
        <div className="filter_drawer_group">
          <div className="filter_drawer_group_title">
            <span className="required">*</span> 名称
          </div>
          <Input ref={inputRef} defaultValue={filterItem.label} placeholder="请输入" size="middle" />
        </div>

        <div className="filter_drawer_group">
          <div className="filter_drawer_group_title">设为默认</div>
          <Radio.Group onChange={onRadioChange} defaultValue={!!filterItem.default} size="small">
            <Radio value>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </div>

        <div className="filter_drawer_group">
          <div className="filter_drawer_group_add">
            <Button type="dashed" block onClick={addEvent} icon={<IconFont type="lmweb-plus-circle" />} size="middle">
              新增筛选项
            </Button>
          </div>

          <VirtualList options={filterItemData} className="filter_drawer_group_list">
            {({ item, ...resetProps }) => {
              return (
                <div {...resetProps} className="filter_drawer_group_item">
                  <ListItem {...item} />
                </div>
              )
            }}
          </VirtualList>
        </div>
      </Drawer>
    </>
  );
};

export default Index;
