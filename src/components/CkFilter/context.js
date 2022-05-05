// store.js
// 配合Context 进行状态管理
import { createContext, useContext, useReducer } from 'react';

const initialState = {
  originProps: { data: [] }, // 原始数据
  instance: { data: [], fullData: [], filterValues: {}, placeholder: '请输入', custom: false, search: true, searchKey: 'search', levelGroupKey: 'levGroup', filter: true, complex: true }, // 初始化数据
  filterValues: {}, // 当前过滤的数据的键值对
  visibleFields: [], // 显示的字段
  orderFields: [], // 排序的字段
  isMore: false, // 是否展示更多筛选项, 数量大于5时展示

  customFilterValues: {}, // 一级筛选过滤的内容

  customDrawer: { visible: false, data: {} }, // 抽屉数据
  customModal: { visible: false, data: {} }, // 弹窗数据
};

const reducer = (state, action) => {
  const { options, instance, filterValues, visibleFields, orderFields, customDrawer, customModal, customFilterValues } = action;
  switch (action.type) {
    // 仅在初始化时触发
    case 'initOptions':
      return { ...state, ...options };

    case 'initInstance':
      return { ...state, originProps: instance, instance: { ...state.instance, ...instance } };
    case 'changeInstance':
      return { ...state, instance: { ...state.instance, ...instance } };
    case 'changeFilterValues':
      return { ...state, filterValues };
    case 'changeVisibleFields':
      return { ...state, visibleFields };
    case 'changeOrderFields':
      return { ...state, orderFields };

    case 'changeDrawer':
      return { ...state, customDrawer };
    case 'changeModal':
      return { ...state, customModal };
    case 'changeCustomFilterValues':
      return { ...state, customFilterValues };

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
