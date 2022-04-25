import { Checkbox, DatePicker, Input, Radio } from 'antd';
import cn from 'classnames';
import moment from 'moment';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { IconFont, VirtualList } from '@/components';
import { getIsHas, getRanges } from '../utils';

// 输入框过滤器
const InputFilter = ({ getFilterValue, setFilterValue }) => {
  const inputRef = useRef(null);

  // 单选事件
  const onChange = (val) => setFilterValue(val);

  return (
    <div className="filter_dropdown">
      <div className="filter_header">
        <Input.Search
          ref={inputRef}
          defaultValue={getFilterValue}
          allowClear
          size="small"
          placeholder="请输入"
          onSearch={onChange}
        />
      </div>
    </div>
  );
};

// 下拉单选过滤器
const SelectFilter = ({ filters, getFilterValue, setFilterValue }) => {
  const inputRef = useRef(null);
  // 搜索后的筛选项
  const [options, setOptions] = useState(filters);

  // 是否存在搜索, 当数据大于8时存在搜索
  const isSearch = useMemo(() => filters.length > 8, [filters.length]);

  // 搜索
  const handleFilter = (val) => {
    setOptions(filters.filter(v => v.label.indexOf(val) > -1));
  };

  // 单选事件
  const onChange = (e, item) => {
    e.preventDefault();
    setFilterValue(item.value);
  };

  return (
    <div className="filter_dropdown">
      {isSearch && <div className="filter_header">
        <Input.Search ref={inputRef} allowClear size="small" placeholder="请输入" onSearch={handleFilter} />
      </div>}

      <div className="filter_body">
        <VirtualList options={options} className="filter_list">
          {({ item, ...resetProps }) => {
            return (
              <div {...resetProps} className={cn('filter_item', { checked: item.value === getFilterValue })} onClick={(e) => onChange(e, item)}>
                <div className="filter_item-content">{item.label}</div>
              </div>
            )
          }}
        </VirtualList>

        {!options.length && <div className="filter_empty">暂无数据</div>}
      </div>
    </div>
  )
};

// 下拉多选过滤器: 要过滤的数据, 当前选中项, 触发过滤, 过滤前的数据
const CheckboxFilter = ({ filters, getFilterValue, setFilterValue, getPreFilteredUniqueValues }) => {
  const inputRef = useRef(null);
  const [checkedValues, setCheckedValues] = useState(getFilterValue || []);
  // 搜索后的筛选项
  const [options, setOptions] = useState(filters);

  // 是否存在搜索, 当数据大于8时存在搜索
  const isSearch = useMemo(() => filters.length > 8, [filters.length]);

  // 是否半选
  const indeterminate = useMemo(() => checkedValues.length && checkedValues.length < filters.length, [checkedValues.length, filters.length]);

  // 是否全选
  const checkAll = useMemo(() => checkedValues.length === filters.length, [checkedValues.length, filters.length]);

  // 全选事件
  const onCheckAllChange = () => {
    const nValue = checkAll ? [] : filters.map(v => v.value);
    setCheckedValues(nValue);
  };

  // 搜索
  const handleFilter = (val) => {
    setOptions(filters.filter(v => v.label.indexOf(val) > -1));
  };

  // 确定
  const handleSure = () => { setFilterValue(checkedValues) };

  // 清空
  const handleReset = () => {
    inputRef.current.state.value = '';
    setFilterValue(undefined);
  };

  // 单选事件
  // const onChange = (values) => setCheckedValues(values || undefined);
  const onChange = (e, item) => {
    e.preventDefault();
    const arr = checkedValues.includes(item.value) ? checkedValues.filter(v => v !== item.value) : [...checkedValues, item.value];
    setCheckedValues(arr || undefined);
    !isSearch && setFilterValue(arr, 'single');
  };

  return (
    <div className="filter_dropdown">
      {isSearch && <div className="filter_header">
        <Input.Search ref={inputRef} allowClear size="small" placeholder="请输入" onSearch={handleFilter} />
        <div className="filter_header_operate">
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll} className="filter_tip">全部</Checkbox>
          <div><span className="filter_tip">已选: {checkedValues.length}</span></div>
        </div>
      </div>}

      <Checkbox.Group value={checkedValues} className="filter_body">
        <VirtualList options={options} className="filter_list">
          {({ item, ...resetProps }) => {
            return (
              <div {...resetProps} className={cn('filter_item', { checked: checkedValues.includes(item.value) })} onClick={(e) => onChange(e, item)}>
                <Checkbox value={item.value} className="filter_item-content">{item.label}</Checkbox>
              </div>
            )
          }}
        </VirtualList>

        {!options.length && <div className="filter_empty">暂无数据</div>}
      </Checkbox.Group>

      {isSearch && <div className="filter_footer">
        <div className="footer_save" onClick={handleSure}>确定</div>
        <div className="footer_clear" onClick={handleReset}>清空</div>
        {/* <Button type="primary" size="small" onClick={handleSure}>确定</Button>
        <Button size="small" onClick={handleReset}>清空</Button> */}
      </div>}
    </div>
  )
};

// 更多筛选
const MoreFilter = ({ filters, getFilterValue, setFilterValue }) => {
  // const [checkedValues, setCheckedValues] = useState(() => filters.filter(v => v.fixed).map(v => v.field));

  // 选中的数据
  const checkedValues = useMemo(() => getFilterValue, [getFilterValue]);

  // 排序后的数组
  const options = useMemo(() => filters, [filters]);

  // 是否可置顶, 第一项无置顶操作, 所以这里的index > 0
  const isTop = useCallback((item) => checkedValues.includes(item.field) && filters.findIndex(v => v.field === item.field) > 0, [checkedValues, filters]);

  // 是否半选
  const indeterminate = useMemo(() => checkedValues.length && checkedValues.length < options.length, [checkedValues.length, options.length]);

  // 是否全选
  const checkAll = useMemo(() => checkedValues.length === options.length, [checkedValues.length, options.length]);

  // 全选事件
  const onCheckAllChange = () => {
    // const nValue = checkAll ? [] : options.map(v => v.field);
    // setCheckedValues(nValue);

    setFilterValue(options, checkAll ? 'hidden' : 'show')
  };

  // 重置
  const handleReset = () => setFilterValue(null, 'reset');

  // 置顶操作, 防止频繁操作, 建议加上节流
  const handleTop = (e, item) => {
    e.stopPropagation();
    setFilterValue(item, 'top');
  };

  // 单选事件
  const onChange = (e, item) => {
    e.preventDefault();
    setFilterValue(item);
  };

  return (
    <div className="filter_dropdown">
      <div className="filter_header">
        <div className="filter_header_operate">
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
            全部
          </Checkbox>
          <div>
            <span className='filter_reset' onClick={handleReset}>
              重置
            </span>
          </div>
        </div>
      </div>
      <Checkbox.Group value={checkedValues} className="filter_body">
        <VirtualList options={options} className="filter_list">
          {
            ({ item, ...resetProps }) => (
              <div {...resetProps} className="filter_item" onClick={(e) => onChange(e, item)}>
                <Checkbox value={item.field} className="filter_item-content">
                  {item.title}
                </Checkbox>
                <div className="filter_item_operate">
                  {isTop(item) && (
                    <IconFont type="lmweb-vertical-align-top" className="icon_top" onClick={(e) => handleTop(e, item)} />
                  )}
                </div>
              </div>
            )
          }
        </VirtualList>
      </Checkbox.Group>
    </div>
  );
};

// 日期范围选择器
const DatePickerFilter = ({ getFilterValue, setFilterValue, props }) => {

  // 对日期格式的转换, 日期组件仅接收moment格式
  const value = useMemo(() => {
    let nValue;
    if (getFilterValue) {
      nValue = [moment(getFilterValue[0]), moment(getFilterValue[1])];
    }
    return nValue;
  }, [getFilterValue]);

  // 最近的时间段, 值为JSON转换后的字符串
  const ranges = useMemo(() => {
    return Object.entries(getRanges()).map((item, i) => ({ id: i, label: item[0], value: JSON.stringify(item[1]) }));
  }, []);

  // 选中时间段的触发
  const onChange = (dates, dateStrings) => {
    setFilterValue(getIsHas(dateStrings.filter(v => !!v)) ? dateStrings : null);
  };

  // 最近的时间触发事件
  const handleLastDateOnChange = (e) => {
    const nValue = JSON.parse(e.target.value);
    setFilterValue(nValue);
  };

  const panelRender = (panelNode) => {
    return (
      <div className="filter_picker_box">
        {/* 左侧边栏 */}
        {/* <div className="filter_picker_aside">
          <div className="filter_picker_aside_item active">登记时间</div>
          <div className="filter_picker_aside_item">审核时间</div>
          <div className="filter_picker_aside_item">交付时间</div>
        </div> */}
        <div className="filter_picker_main">
          <div className="filter_picker_header">
            <div className="filter_picker_header_tip">{getFilterValue && `${getFilterValue[0]} - ${getFilterValue[1]}`}</div>
            <div className="filter_picker_header_operate">
              <Radio.Group value={JSON.stringify(getFilterValue)} onChange={handleLastDateOnChange} size="small">
                {ranges.map(v => <Radio.Button key={v.label} value={v.value}>{v.label}</Radio.Button>)}
              </Radio.Group>
            </div>
          </div>
          {panelNode}
        </div>
      </div>
    )
  };

  return (
    <>
      <DatePicker.RangePicker value={value} onChange={onChange} panelRender={panelRender} dropdownClassName="filter_dropdown_picker" bordered={false} picker="date" size="small" separator="至" placeholder={['开始日期', '结束日期']} style={{ width: 200 }} {...props} />
    </>
  )
};

const FilterComp = (props) => {
  const { type, ...resetProps } = props;
  switch (type) {
    case 'input':
      return <InputFilter {...resetProps} />;
    case 'select':
      return <SelectFilter {...resetProps} />
    case 'checkbox':
      return <CheckboxFilter {...resetProps} />
    case 'datePicker':
      return <DatePickerFilter {...resetProps} />
    case 'more':
      return <MoreFilter {...resetProps} />
    default:
      return <CheckboxFilter {...resetProps} />
  }
}

export default FilterComp;