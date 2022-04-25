import React, { useState } from 'react';
import { Space, Popover, Typography, message } from 'antd';
import CkTable from '@/components/CkTable';
import { State } from '@/components/Render';
import './styles.less'

const { Paragraph } = Typography;


// 复杂数据表格
const Demo = () => {
  const [width, setWidth] = useState(400);

  const handleClick = () => {
    const nValue = width > 300 ? 30 : 400;
    setWidth(nValue);
  };

  const columns = React.useMemo(
    () => [
      {
        title: 'checkbox',
        type: 'checkbox',
        accessor: 'checkbox',
        width: 100,
        fixed: 'left',
      },
      {
        Header: '物料',
        title: '物料',
        fixed: 'left',
        width: 300,
        accessor: 'material',
        Cell: ({ value, row }) => {
          const { img, material } = row.original;
          return <Space
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Popover
              placement="rightTop"
              trigger="hover"
              content={() => <img src={img} alt={img} width={260} />}
            >
              <img src={img} alt={img} width={36} height={36} />
            </Popover>
            <div>
              <Space direction="vertical" size={0}>
                <a href='/#' onClick={(e) => { e.stopPropagation() }}>
                  {material}
                </a>
                <Paragraph copyable={{ tooltips: false, onCopy: () => message.success('复制成功！', 1.5) }}>
                  {value}
                </Paragraph>
              </Space>
            </div>
          </Space>
        }
      },
      {
        title: '状态',
        accessor: 'state',
        width: 180,
        filter: 'checkbox',
        Cell: ({ value }) => <State dom={value} />,
      },
      {
        title: '名称',
        accessor: 'name',
        width: 400
      },
      {
        title: '供货商/货号',
        accessor: 'number',
        width: 390,
        Cell: ({ value, row }) => {
          const { supplier } = row.original;
          return (
            <Space
              direction="vertical"
              size={0}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <a href='/#' onClick={(e) => e.stopPropagation()}>{supplier}</a>
              <Paragraph copyable={{ tooltips: false, onCopy: () => message.success('复制成功！', 1.5) }}>
                {value}
              </Paragraph>
            </Space>
          );
        },
      },
      {
        title: '联系人/号码',
        accessor: 'phone',
        width: 140,
        Cell: ({ value, row }) => (
          <Space
            direction="vertical"
            size={0}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <span>{row.original.contactUser}</span>
            <Paragraph copyable={{ tooltips: false, onCopy: () => message.success('复制成功！', 1.5) }}>
              {value}
            </Paragraph>
          </Space>
        ),
      },
      {
        title: '分类',
        accessor: 'category',
        width: 140,
        filter: 'checkbox',
      },
      { title: '类型', accessor: 'type', width: 140 },
      { title: '物料成分', accessor: 'mar', width: 100 },
      {
        title: '总金额',
        align: 'right',
        accessor: 'money',
        width: 100,
      },
      {
        title: '备注',
        accessor: 'remark',
        width: 140,
        Cell: ({ value }) => {
          return (
            <>
              <Paragraph
                editable={{
                  editing: false,
                }}
                ellipsis={{
                  tooltip: true,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {value}
              </Paragraph>
            </>
          );
        },
      },
    ],
    [],
  );

  const markDate = new Array(500).fill().map((item, index) => {
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
  });

  const data = React.useMemo(() => markDate, [markDate]);



  return (
    // <div style={{ height: 600 }}>
    //   <CkTable columns={columns} data={data} height={48} />
    // </div>
    <div style={{ height: 600, display: 'flex' }}>
      <div className="left" style={{ height: '100%', width: width, border: '1px solid #666' }} onClick={handleClick}></div>
      <div style={{ height: '100%', flex: 1, overflow: 'hidden' }}>
        <CkTable columns={columns} data={data} height={48} />
      </div>
    </div>
  )
};

export default Demo;
