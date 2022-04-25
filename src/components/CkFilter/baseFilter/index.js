import React, { useRef } from 'react';
import { useStore } from '../context';
import { Input } from 'antd';
import FilterMenu from './filterMenu';
import MoreFilters from './moreFilters';
import { getIsHas } from '../utils';

/* 二级筛选：基础过滤
 * data
 * 
*/
const Filter = () => {
  const inputRef = useRef(null);
  const { state: { instance: { data, onChange, placeholder, searchKey }, isMore, filterValues }, dispatch } = useStore();

  const handleFilter = (val) => {
    const nValue = { ...filterValues };
    getIsHas(val) ? (nValue[searchKey] = val) : (delete nValue[searchKey]);
    dispatch({ type: 'changeFilterValue', filterValues: nValue });
    onChange(nValue);
  };

  return (
    <div className='filter_base'>
      <div className="filter_search">
        <Input.Search ref={inputRef} allowClear size="small" placeholder={placeholder} onSearch={handleFilter} />
      </div>

      {data?.filter((v) => !isMore || !!v.fixed)?.map(v => (<FilterMenu key={v.field} {...v} />))}
      {/* <MoreFilters /> */}
      {isMore && <MoreFilters />}
    </div>
  )
};

export default Filter;
