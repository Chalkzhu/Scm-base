import React, { useCallback, useEffect, useMemo } from 'react';
import cn from 'classnames';
import { Button, Form, Radio, Select, Space } from 'antd';
import { EditModal } from '@/components';
import { useStore } from '../context';
import { getIsHas } from '../utils';

const ButtonTags = ({ value, onChange, options }) => {

  const handleClick = (item) => {
    const oriValue = value || [];
    const has = oriValue?.includes(item.value);
    const nValue = has ? oriValue.filter((v) => v !== item.value) : [...oriValue, item.value];
    onChange?.(nValue);
  };

  return (
    <>
      <Space size={8} wrap className="auto_height">
        {options?.map(v => (
          <div key={v.value} className={cn('checkbox_tag', {
            active: value?.includes(v.value)
          })} onClick={() => handleClick(v)}>
            {v.label}
          </div>
        ))}
      </Space>
    </>
  )
};

const ModalItem = () => {
  const { state, dispatch } = useStore();
  const { customModal, customDrawer, instance } = state;
  const [form] = Form.useForm();

  // 是否编辑
  const isEdit = useMemo(() => getIsHas(customModal.data), [customModal.data]);

  const onClose = () => {
    dispatch({ type: 'changeModal', customModal: { ...customModal, visible: false } });
    form.resetFields();
  };

  const onSave = async () => {
    try {
      const { field, ...values } = await form.validateFields();

      const filterValues = {
        ...customDrawer.data.filterValues,
        [customModal.data.field]: values,
      };
      const nValue = {
        ...customDrawer,
        data: { ...customDrawer.data, filterValues }
      }
      console.log('customDrawer', nValue);
      dispatch({
        type: 'changeDrawer',
        customDrawer: nValue,
      })
    } catch (error) {
      console.log('校验错误！', error);
    }
  };

  const onValuesChange = (values) => {
    if (values.field) {
      form.setFieldsValue({ value: [] });
    }
  };

  // 动态展示选择框
  const DynamicSelect = useCallback(({ getFieldValue }) => {
    const field = getFieldValue('field');
    const options = instance.fullData.find(v => v.field === field)?.data || [];
    if (field) {
      return (
        <Form.Item name="value" label="选择字段值">
          <ButtonTags options={options} />
        </Form.Item>
      )
    }
  }, [instance.fullData]);

  const config = {
    title: isEdit ? '编辑' : '新增查询项',
    visible: customModal.visible,
    onCancel: onClose,
    bodyStyle: { padding: 24 },
    footer: [
      <Button key="cancel" onClick={onClose} size="middle">
        取消
      </Button>,
      <Button type="primary" key="back" onClick={onSave} size="middle">
        确定
      </Button>,
    ],
  };

  // 初始化重置数据
  useEffect(() => {
    if (customModal.visible) { form.setFieldsValue(customModal.data) }
  }, [form, customModal])


  return (
    <>
      <EditModal {...config}>
        <div className="custom_modal">
          <Form form={form} initialValues={{ mode: 'or' }} onValuesChange={onValuesChange} layout="vertical" size="default">
            <Form.Item name="field" label="选择字段">
              <Select>
                {state.instance.fullData.map(v => <Select.Option key={v.field} value={v.field}>{v.title}</Select.Option>)}
              </Select>
            </Form.Item>

            <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.field !== currentValues.field}>
              {DynamicSelect}
            </Form.Item>
            <Form.Item name="mode" label="查询方式">
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="and">且,查询同时满足此选项条件</Radio>
                  <Radio value="or">或,查询包含此选项条件</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Form>
        </div>
      </EditModal>
    </>
  )
};

export default ModalItem;
