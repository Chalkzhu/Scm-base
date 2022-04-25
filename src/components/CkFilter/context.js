// store.js
// 配合Context 进行状态管理
import { createContext, useContext, useReducer } from 'react';


const initialState = {
  originProps: { data: [] }, // 原始数据
  instance: { data: [], filterValues: {}, placeholder: '请输入', searchKey: 'search' }, // 初始化数据
  filterValues: {}, // 当前过滤的数据的键值对
  isMore: false, // 是否展示更多筛选项, 数量大于5时展示
};

const reducer = (state, action) => {
  const { instance, filterValues } = action;
  switch (action.type) {
    // 仅在初始化时触发
    case 'initInstance': {
      const obj = instance.filterValues || {};
      instance.data.forEach(v => { v.fixed && v?.value && (obj[v.field] = v.value) });
      return { ...state, originProps: instance, instance: {...state.instance, ...instance}, filterValues: obj, isMore: instance.data?.length > 5 };
    };
    case 'changeInstance':
      return { ...state, instance: {...state.instance, ...instance} };
    case 'changeFilterValue':
      return { ...state, filterValues };
    default:
      throw new Error();
  }
};

const useContent = () => useReducer(reducer, initialState);
const Context = createContext();
const useStore = () => useContext(Context)
export {
  Context,
  useContent,
  useStore
};
