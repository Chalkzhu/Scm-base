import React, { useState } from 'react';
import { Button, Space, Popover, Typography, message } from 'antd';
// import CkTable from '@/components/CkTable';
import CkTable from 'ck-table';
// import CkTable from 'r-table';
import { State } from '@/components/Render';
import './styles.less'

const { Paragraph, Text } = Typography;


// 复杂数据表格
const Demo = () => {
  const [size, setSize] = React.useState(50)
  const [width, setWidth] = useState(400);

  const handleSize = (count) => {
    setSize(count);
  };

  const handleClick = () => {
    const nValue = width > 300 ? 30 : 400;
    setWidth(nValue);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'checkbox',
        type: 'checkbox',
        accessor: 'checkbox',
        width: 100,
        fixed: 'left',
      },
      {
        Header: '状态',
        accessor: 'state',
        width: 180,
        filter: 'checkbox',
      },
      {
        Header: '名称',
        accessor: 'name',
        width: 400
      },
      {
        Header: '供货商/货号',
        accessor: 'number',
        width: 390,
        Cell: ({ row }) => {
          const { supplier, number } = row.original;
          return (
            <Space
              direction="vertical"
              size={0}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <a onClick={(e) => e.stopPropagation()}>{supplier}</a>
              <Paragraph copyable={{ tooltips: false, onCopy: () => message.success('复制成功！', 1.5) }}>
                {number}
              </Paragraph>
            </Space>
          );
        },
      },
      {
        Header: '联系人/号码',
        accessor: 'phone',
        width: 140,
        Cell: ({ row }) => {
          const { phone, contactUser } = row.original;
          return (
            <Space
              direction="vertical"
              size={0}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <span>{contactUser}</span>
              <Paragraph copyable={{ tooltips: false, onCopy: () => message.success('复制成功！', 1.5) }}>
                {phone}
              </Paragraph>
            </Space>
          )
        },
      },
      {
        Header: '分类',
        accessor: 'category',
        width: 140,
        filter: 'checkbox',
      },
      { Header: '类型', accessor: 'type', width: 140 },
      { Header: '物料成分', accessor: 'mar', width: 100 },
      {
        Header: '总金额',
        align: 'right',
        accessor: 'money',
        width: 100,
      },
      {
        Header: '备注',
        accessor: 'remark',
        width: 140,
        ellipsis: true
      },
    ],
    [],
  );

  const data = React.useMemo(() => {
    return new Array(size).fill().map((item, index) => {
      return {
        id: index,
        title: '物料的名称',
        code: `MLY001Y002009${index}Y`,
        name: 'asdasdName',
        material: '物料名称',
        materialCode: `MLY001Y002009${index}Y`,
        img: 'http://www.wuliwu.top/logo.png',
        state: index % 3 ? 'ok' : index % 2 ? 'disable' : 'wait',
        supplier: '供应商名称',
        number: 'MLY001',
        contactUser: '联系人',
        phone: '13131313131',
        category: index % 2 ? '牛仔' : '非牛仔',
        type: '面料',
        firstName: index % 2 ? '张' : '王',
        lastName: index % 3 ? '3' : '4',
        age: index % 3 ? '17' : '28',
        visits: index % 3 ? '78' : '62',
        progress: index % 3 ? '88' : '99',
        status: index % 3 ? 'single' : 'relationship',
        money: Math.floor(Math.random() * 2000) * index,
        remark: '这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注',
      };
    })
  }, [size]);



  return (
    <div style={{ height: 600 }} className="container">
      <div className="operate">
        <Button onClick={() => handleSize(10)}>切换 10 条数据</Button>
        <Button onClick={() => handleSize(50)}>切换 50 条数据</Button>
        <Button onClick={() => handleSize(500)}>切换 500 条数据</Button>
        <Button onClick={() => handleSize(1000)}>切换 1000 条数据</Button>
        <Button onClick={() => handleSize(10000)}>切换 10000 条数据</Button>
        <Button onClick={() => handleSize(100000)}>切换 100000 条数据</Button>
      </div>
      <div className="grid">
        <div className="left" style={{ width: width }} onClick={handleClick}>
          这是伸缩侧，点击伸缩
        </div>
        <div className="right">
          <CkTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  )
};

export default Demo;
