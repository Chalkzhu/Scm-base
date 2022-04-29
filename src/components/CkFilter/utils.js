import dayjs from 'dayjs';
// 检查是否存在内容: 数字、布尔值、非空数组、非空对象
export function getIsHas(val) {
  // 检查是否数字、布尔类型
  let flag = !!val || typeof val === 'number' || typeof val === 'boolean';
  // 检查空对象和空数组
  if (!!val && typeof val === 'object') { flag = Array.isArray(val) ? !!val.length : !!Object.keys(val)?.length }
  return flag;
}

export const render = (Comp, props) => !Comp ? null : isReactComponent(Comp) ? <Comp {...props} /> : Comp;

// 检查是否React组件
export function isReactComponent(component) {
  return (
    isClassComponent(component) ||
    typeof component === 'function' ||
    isExoticComponent(component)
  )
}

// 检查是否类组件
export function isClassComponent(component) {
  return (
    typeof component === 'function' &&
    (() => {
      const proto = Object.getPrototypeOf(component)
      return proto.prototype && proto.prototype.isReactComponent
    })()
  )
}

// 检查是否自定义组件
export function isExoticComponent(component) {
  return (
    typeof component === 'object' &&
    typeof component.$$typeof === 'symbol' &&
    ['react.memo', 'react.forward_ref'].includes(component.$$typeof.description)
  )
}

export function getRanges() {
  return {
    '近一周': [dayjs().subtract(7, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
    '近一月': [dayjs().subtract(1, 'month').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
    '近一年': [dayjs().subtract(1, 'year').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
  }
}
