import React, { Fragment } from 'react';
import Filter from '@/components/CkFilter';

const data = [
  {
    id: '1',
    type: 'select',
    title: '状态',
    field: 'state',
    fixed: true,
    data: new Array(60).fill().map((item, index) => ({ id: index + 1, label: `label${index}`, value: index + 'k' }))
    // data: [
    //   { id: '1', label: '已确认', value: 'ok' },
    //   { id: '2', label: '未确认', value: 'no' },
    //   { id: '3', label: '已冻结', value: 'fixed' },
    // ],
  },
  {
    id: '2',
    type: 'select',
    title: '状态1',
    field: 't1',
    fixed: true,
    data: [
      { id: '1', label: '已确认', value: 'ok' },
      { id: '2', label: '未确认', value: 'no' },
      { id: '3', label: '已冻结', value: 'fixed' },
    ],
  },
  {
    id: 't',
    type: 'date',
    title: '创建时间',
    field: 'createdDate',
    fixed: true,
    value: ['2022-04-12', '2022-04-21'],
  },
  {
    id: '3',
    type: 'checkbox',
    title: '类型',
    fixed: false,
    field: 'type',
    value: ['22k'],
    data: new Array(60).fill().map((item, index) => ({ id: index + 1, label: `label${index}`, value: index + 'k' }))
    // data: [
    //   { id: '1', label: '面料', value: 'ok1' },
    //   { id: '2', label: '辅料', value: 'no2' },
    //   { id: '3', label: '牛仔', value: 'fixed3' },
    // ],
  },
  {
    id: '4',
    type: 'select',
    title: '状态4',
    field: 't4',
    data: [
      { id: '1', label: '已确认', value: 'ok' },
      { id: '2', label: '未确认', value: 'no' },
      { id: '3', label: '已冻结', value: 'fixed' },
    ],
  },
  {
    id: '5',
    type: 'select',
    title: '状态5',
    field: 't5',
    fixed: true,
    data: [
      { id: '1', label: '已确认', value: 'ok' },
      { id: '2', label: '未确认', value: 'no' },
      { id: '3', label: '已冻结', value: 'fixed' },
    ],
  },
  {
    id: '6',
    type: 'select',
    title: '状态6',
    field: 't6',
    fixed: true,
    data: [
      { id: '1', label: '已确认', value: 'ok' },
      { id: '2', label: '未确认', value: 'no' },
      { id: '3', label: '已冻结', value: 'fixed' },
    ],
  },
];


const Demo = () => {

  const getChange = (val) => {
    console.log('val', val)
  };

  return (
    <Fragment>
      <div style={{ backgroundColor: '#fff', width: 800, height: 800, padding: 60 }}>
        <Filter data={data} onChange={getChange} placeholder="请输入编号" searchKey="code" />
      </div>
    </Fragment>
  )
};

export default Demo;
