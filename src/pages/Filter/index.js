import React, { useState, Fragment, useRef } from 'react';
import Filter from '@/components/CkFilter';

const originata = [
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
    dateType: 'date',
    title: '创建时间',
    field: 'createdDate',
    fixed: true,
    // value: ['2022-04-12', '2022-04-21'],
    value: '2022-04-12',
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
  const [data, setData] = useState(originata);
  const fRef = useRef(null);

  // 自定义筛选数据定义
  const customFilter = [
    { label: '全部', value: 'all', filterValues: {} },
    { label: '我关注的', value: 'v1', filterValues: { state: { value: ['22k', '32k'], mode: 'and' }, t1: {} }, default: true },
    { label: '自定义1', value: 'diy1', filterValues: { state: { value: '', mode: 'or' } } },
    { label: '自定义2', value: 'diy2', filterValues: { t1: { value: '', mode: 'or' } } },
    { label: '自定义3', value: 'diy3', filterValues: {} },
  ]

  const group = [
    { label: '全部', value: 'all' },
    { label: '待提交', value: 'z1', default: true },
    { label: '待审核', value: 'z2' },
  ];

  const getChange = (val, lev1) => {
    console.log('val', val, lev1)
  };

  const handleClick = async () => {
    console.log('data', data);
    await setData([{
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
    },]);
    fRef.current.setOptions();
  };

  return (
    <Fragment>
      <div style={{ backgroundColor: '#fff', width: 800, height: 800, padding: 60 }}>
        <Filter ref={fRef} data={data} custom={customFilter} levelGroup={group} fullData={data} onChange={getChange} placeholder="请输入编号" searchKey="code" />
        <hr />
        <div onClick={handleClick}>重置数据</div>
      </div>
    </Fragment>
  )
};

export default Demo;
