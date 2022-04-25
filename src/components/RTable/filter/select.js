
import React, { useState, useRef } from 'react';
import { Button, Input, Select, Checkbox } from 'antd';

// 默认过滤器
const DefaultColumnFilter = ({ getColumnFilterValue, setColumnFilterValue, getPreFilteredUniqueValues }) => {
  const onChange = (e) => {
    setColumnFilterValue(e.target.value || undefined);
  };

  return (
    <div className="ck-table-filter-dropdown">
      <div className="ck-table-filter-header">
        <Input value={getColumnFilterValue() ?? ''} placeholder="搜索筛选项" onChange={onChange} />
      </div>
    </div>
  )
};

// 下拉过滤器
const CheckboxFilter = ({ filters, getColumnFilterValue, setColumnFilterValue, getPreFilteredUniqueValues }) => {
  const inputRef = useRef(null);
  const [checkedValues, setCheckedValues] = useState(getColumnFilterValue);
  const [hasValue, setHasValue] = useState();

  const options = React.useMemo(() => {
    // return [...getPreFilteredUniqueValues().keys()];
    return filters;
  }, []);

  const onChange = (values) => { setCheckedValues(values || undefined) };

  const handleFilter = (e) => {
    const v = e.target.value;
    setHasValue(v);
  };

  const handleSure = () => {
    setColumnFilterValue(checkedValues);
  };

  const handleReset = () => {
    inputRef.current.state.value = ''
    setColumnFilterValue(undefined);
    setHasValue(undefined);
  };

  return (
    <div className="ck-table-filter-dropdown">
      <div className="ck-table-filter-header">
        <Input ref={inputRef} placeholder="搜索筛选项" onChange={handleFilter} />
      </div>
      <Checkbox.Group value={checkedValues} onChange={onChange} className="ck-table-filter-body">
        <ul className="ck-table-filter-list">
          {
            options.map(({value, label}, i) => (
              <li key={value || i} className="ck-table-filter-item" disabled={hasValue && value.indexOf(hasValue) < 0}>
                <Checkbox value={value} className="ck-table-filter-item-content">{label}</Checkbox>
              </li>
            ))
          }
        </ul>
        {
          hasValue && !options.some(({value}) => value.indexOf(hasValue) > -1) && <div className="ck-table-filter-empty">暂无数据</div>
        }
      </Checkbox.Group>
      <div className="ck-table-filter-footer">
        <Button size="small" onClick={handleReset}>重置</Button>
        <Button type="primary" size="small" onClick={handleSure}>确定</Button>
      </div>
    </div>
  )
};

// 下拉过滤器
const SelectColumnFilter = ({ filters, getColumnFilterValue, setColumnFilterValue, getPreFilteredUniqueValues }) => {

  const onChange = (value) => {
    setColumnFilterValue(value || undefined);
  };

  return (
    <Select value={getColumnFilterValue()} onChange={onChange} style={{ width: 120, fontSize: 12 }} allowClear size="small" placeholder="请选择">
      {filters.map(({label, value}) => (
        <Select.Option key={value} value={value}>
          {label}
        </Select.Option>
      ))}
    </Select>
  )
};

export {
  DefaultColumnFilter,
  CheckboxFilter,
  SelectColumnFilter,
};
