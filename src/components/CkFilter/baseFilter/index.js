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
  const { state: { instance: { data, onChange, placeholder, searchKey, search, filter }, isMore, filterValues, visibleFields, orderFields, customFilterValues }, dispatch } = useStore();

  // 输入框查询事件
  const handleFilter = (val) => {
    const nValue = { ...filterValues };
    if (!getIsHas(val) && !getIsHas(nValue[searchKey])) {
      return false;
    }
    getIsHas(val) ? (nValue[searchKey] = val) : (delete nValue[searchKey]);
    dispatch({ type: 'changeFilterValues', filterValues: nValue });
    onChange?.(nValue, customFilterValues);
    return false;
  };

  return (
    <>
      {/* 输入框 */}
      {search && (
        <div className="filter_search">
          <Input.Search ref={inputRef} allowClear size="small" placeholder={placeholder} onSearch={handleFilter} />
        </div>
      )}

      {/* 基础筛选 */}
      {filter && (
        <>
          {data
            ?.filter((v) => visibleFields.includes(v.field))
            ?.sort((a, b) => orderFields.indexOf(a.field) - orderFields.indexOf(b.field))
            ?.map((v) => (
              <FilterMenu key={v.field} {...v} />
            ))}
          {isMore && <MoreFilters />}
        </>
      )}
    </>
  )
};

export default Filter;
