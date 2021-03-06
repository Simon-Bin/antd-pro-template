import React from 'react';
import { Button, Card, Col, Form, Input, Row } from 'antd';

import { ColumnProps } from 'antd/es/table';
import { FormComponentProps } from 'antd/es/form';
import Link from 'umi/link';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import { WrappedFormUtils } from 'antd/es/form/Form';
import router from 'umi/router';
import { queryPoll } from './service';
import {
  EasyHouseSelect,
  EasySearchForm,
  EasyTable,
  GolobalSearchFormLayout,
} from '@/easy-components';
import { usePagableFetch } from '@/hooks';
import { PollTableItem, PollTableSearch } from './data.d';

interface PollTableProps extends FormComponentProps {}

const PollTable: React.FC<PollTableProps> = () => {
  const columns: ColumnProps<PollTableItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      render(text, record, index) {
        return index + 1;
      },
    },
    {
      title: '投票标题',
      dataIndex: 'title',
    },
    {
      title: '接受对象',
      dataIndex: 'people',
    },
    {
      title: '投票人数',
      dataIndex: 'number',
    },
    {
      title: '结束时间',
      dataIndex: 'finishTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: 150,
      fixed: 'right',
      render: (_, record) => <Link to="/community/poll/info">详情</Link>,
    },
  ];

  const renderSearchForm = (form: WrappedFormUtils<PollTableSearch>) => [
    <Col key="houseId" {...GolobalSearchFormLayout}>
      <Form.Item label="所属小区">
        {form.getFieldDecorator('houseId', {
          rules: [],
        })(<EasyHouseSelect placeholder="请选择" />)}
      </Form.Item>
    </Col>,
    <Col key="content" {...GolobalSearchFormLayout}>
      <Form.Item label="投票标题">
        {form.getFieldDecorator('content', {
          rules: [],
        })(<Input placeholder="请输入" />)}
      </Form.Item>
    </Col>,
    <Col key="options" {...GolobalSearchFormLayout}>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
        <Button
          onClick={() => {
            form.resetFields();
          }}
          style={{ marginLeft: 8 }}
        >
          重置
        </Button>
      </Form.Item>
    </Col>,
  ];

  const { tableData, current, pageSize, total, setCurrent, setSearchForm } = usePagableFetch<
    PollTableItem
  >({
    request: ({ searchForm, pageIndex, pageSize: size }) =>
      queryPoll({ ...searchForm, pageIndex, pageSize: size }),
    onSuccess: ({ res, setTableData, setTotal }) => {
      setTableData(res.data.records);
      setTotal(res.data.total);
    },
    onError: () => {},
  });

  return (
    <PageHeaderWrapper>
      <EasySearchForm
        onSubmit={form => {
          setSearchForm(form);
          setCurrent(1);
        }}
        renderSearchFormItem={renderSearchForm}
        wrappedWithCard
      />
      <Card bordered={false}>
        <Row style={{ marginBottom: 16 }}>
          <Col>
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                router.push('/community/poll/form');
              }}
            >
              发起投票
            </Button>
          </Col>
        </Row>
        <EasyTable<PollTableItem>
          rowKey="id"
          dataSource={tableData}
          pagination={{
            current,
            pageSize,
            total,
          }}
          columns={columns}
          onChange={({ current: index }) => {
            setCurrent(index || 1);
          }}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default PollTable;
