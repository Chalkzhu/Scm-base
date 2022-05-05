import React, { useMemo } from 'react';
import { Radio } from 'antd';
import { useStore } from '../context';

const CustomGroup = () => {
  const { state, dispatch } = useStore();
  const { levelGroup, levelGroupKey } = state.instance;

  const defaultValue = useMemo(() => {
    return levelGroup.find(v => !!v.default)?.value;
  }, [levelGroup]);

  const onChange = (e) => {
    const nValue = {
      [levelGroupKey]: { value: e.target.value, mode: 'and' }
    };
    dispatch({
      type: 'changeCustomFilterValues',
      customFilterValues: nValue
    });
    state.instance.onChange?.(state.filterValues, nValue);
  }

  return (
    <>
      <Radio.Group defaultValue={defaultValue} onChange={onChange} size="small">
        {levelGroup.map(v => <Radio.Button key={v.value} value={v.value}>{v.label}</Radio.Button>)}
      </Radio.Group>
    </>
  )
}

export default CustomGroup;
