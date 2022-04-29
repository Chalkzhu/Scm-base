import React from 'react';
import { Modal } from 'antd';

const Index = (props) => {
  const { visible, wrapClassName, children, ...reset } = props;

  const config = {
    title: '编辑',
    width: 480,
    visible,
    centered: true,
    wrapClassName: wrapClassName ? `${wrapClassName} editModal` : 'editModal',
    okButtonProps: {
      size: 'large',
    },
    cancelButtonProps: {
      size: 'large',
    },
  };

  return (
    <>
      <Modal {...config} {...reset}>
        {children}
      </Modal>
    </>
  );
};

export default Index;
