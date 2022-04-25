import React, { useMemo } from 'react';
import { Button, Checkbox } from 'antd';
// import CkTable from 'r-table';
import { RTable as CkTable } from '@/components';
import './styles.less';

// 简易数据表格
const Demo = () => {
  const tableRef = React.useRef(null);
  const [size, setSize] = React.useState(50)
  const [count, setCount] = React.useState(50);

  const handleSize = (count) => {
    setSize(count);
  };
  const changeCount = (count) => {
    setCount(count);
  };

  const getCheckboxRecords = () => {
    const v = tableRef.current.getCheckboxRecords;
    const v1 = tableRef.current.getInstance().options.render;
    const v2 = tableRef.current.getInstance().render;
    console.log(v, v1, v2);
  };

  const footerMethod = ({column, data}) => {
    return (
      <div>
        <div>{data.reduce((pre, cur) => pre + Number(cur[column.id]) ,0)}</div>
        <div>总: {count}</div>
      </div>
    )
  };


  const columns = useMemo(() => [
    {
      type: 'checkbox',
      id: 'checkbox',
      width: 100,
      maxWidth: 100,
      fixed: 'left',
      footer: () => (<div><div>小计</div><div>总计</div></div>)
    },
    {
      header: '#',
      type: 'seq',
      id: 'seq',
      width: 100,
      maxWidth: 100,
      fixed: 'left',
    },
    {
      header: () => <div><h2>'First Name'</h2></div>,
      title: () => <span>'First Name'</span>,
      accessorKey: 'firstName',
      sort: true,
      filters: [{label: '28岁', value: 28, checked: true},{label: '17岁', value: 17}],
      filterType: 'checkbox',
      visible: false,
      cell: (pr) => {
        return '尼古拉斯凯奇尼古拉斯凯奇尼古拉斯凯奇尼古拉斯凯奇尼古拉斯凯奇尼古拉斯凯奇尼古拉斯凯奇尼古拉斯凯奇尼古拉斯凯奇尼古拉斯凯奇尼古拉斯凯奇尼古拉斯凯奇尼古拉斯凯奇尼古拉斯凯奇'
      }
    },
    {
      header: 'Last Name',
      title: 'Last Name',
      accessorKey: 'lastName',
      width: 100,
      fixed: 'left',
    },
    {
      header: 'remark',
      title: 'remark',
      accessorKey: 'remark',
      width: 1200,
      ellipsis: true,
      // filter: 'select',
      visible: true,
    },
    {
      header: 'Age',
      title: 'Age',
      accessorKey: 'age',
      align: 'right',
      sort: true,
      filters: [{label: '28岁', value: 28, checked: true},{label: '17岁', value: 17}],
      filterType: 'select',
      // filterRender: ({getColumnFilterValue}) => <div>h3 {getColumnFilterValue()}</div>
    },
    {
      header: 'address',
      title: 'address',
      accessorKey: 'address',
      sort: true,
    },
  ], []);

  const data = React.useMemo(() => {
    return new Array(size).fill().map((item, index) => {
      return {
        id: index,
        seq: index + 1,
        title: '物料的名称',
        code: `MLY001Y002009${index}Y`,
        name: '',
        material: index % 3 ? '围裙' : index % 2 ? '帆布' : '牛仔',
        materialCode: `MLY001Y002009${index}Y`,
        img: <img src='http://www.wuliwu.top/logo.png' width={36} alt="这是个图片" />,
        state: index % 3 ? 'ok' : index % 2 ? 'disable' : 'wait',
        supplier: '供应商名称',
        number: 'MLY001',
        contactUser: '联系人',
        phone: '13131313131',
        address: '天堂',
        category: index % 2 ? '牛仔' : '非牛仔',
        type: index % 2 ? '面料' : '辅料',
        firstName: index % 2 ? '张' : '王',
        lastName: index % 3 ? '3' : '4',
        age: index % 3 ? 17 : 28,
        visits: index % 3 ? '78' : '62',
        progress: index % 3 ? '88' : '99',
        status: index % 3 ? 'single' : 'relationship',
        remark: '这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注',
      };
    })
  }, [size]);

  const config = {
    rowConfig: {
      isHover: true,
    },
    sortConfig: {
      trigger: 'cell',
    },
    checkboxConfig: {
      Control: (resetProps) =>  <Checkbox {...resetProps} />,
    },
    toolbar: { setting: true },
    size:"small",
    resizable: true,
    // stripe: true,
    showOverflow: 'tooltip',
    sortChange: ({id, order}) => {
      console.log('sortChange', id, order);
    }
  }

  return (
    <div style={{ height: 600 }} className="container">
      <div className="operate">
        <Button type='primary' onClick={getCheckboxRecords}>获取选中的行</Button>
        <Button onClick={() => handleSize(50)}>切换 50 条数据</Button>
        <Button onClick={() => handleSize(500)}>切换 500 条数据</Button>
        <Button onClick={() => handleSize(1000)}>切换 1000 条数据</Button>
        <Button onClick={() => handleSize(10000)}>切换 10000 条数据</Button>
        <Button onClick={() => handleSize(100000)}>切换 100000 条数据</Button>
        <Button onClick={() => changeCount(300)}>改变总计</Button>
      </div>
      <CkTable ref={tableRef} columns={columns} data={data} {...config} />
    </div>
  )
};

export default Demo;
