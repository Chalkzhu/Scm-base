import React from 'react';
import { Space } from 'antd';

const Index = (props) => {
  const { dom } = props;

  const icon = () => {
    switch (dom) {
      case 'ok':
        return (
          <Space size={4}>
            <i className="iconfont lmweb-check-circle-fill" style={{ color: '#51c41a', fontSize: 14 }} />
            已审核
          </Space>
        );
      case 'wait':
        return (
          <Space size={4}>
            <i className="iconfont lmweb-time-circle-fill" style={{ color: '#1890fc', fontSize: 14 }} />
            待审核
          </Space>
        );
      case 'disable':
        return (
          <Space size={4}>
            <i className="iconfont lmweb-stop" style={{ fontSize: 14 }} />
            禁用
          </Space>
        );

      default:
        return (
          <Space size={4}>
            <i className="iconfont lmweb-check-circle-fill" style={{ color: '#51c41a', fontSize: 14 }} />
            已审核
          </Space>
        );
    }
  };
  return <div>{icon()}</div>;
};

export default Index;
