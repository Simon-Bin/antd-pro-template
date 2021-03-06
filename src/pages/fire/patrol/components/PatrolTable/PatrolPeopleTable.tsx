import React, { FC } from 'react';

import { ColumnProps } from 'antd/es/table';
import { EasyTable } from '@/easy-components';
import { queryPatrolPerson } from '../../service';
import { usePagableFetch } from '@/hooks';
import { PatrolPerson } from '../../data.d';

interface PatrolPeopleTableProps {}

const PatrolPeopleTable: FC<PatrolPeopleTableProps> = () => {
  const { tableData, current, pageSize, total, setCurrent } = usePagableFetch<PatrolPerson>({
    initPageSize: 5,
    request: ({ pageIndex, pageSize: size }) => queryPatrolPerson({ pageIndex, pageSize: size }),
    onSuccess: ({ res, setTableData, setTotal }) => {
      setTableData(res);
      setTotal(res.length);
    },
    onError: () => {
      // console.log(err);
    },
  });

  const columns: ColumnProps<PatrolPerson>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      render(text, record, index) {
        return index + 1;
      },
    },
    {
      title: '小区',
      dataIndex: 'houseName',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
  ];

  return (
    <EasyTable<PatrolPerson>
      rowKey="id"
      columns={columns}
      dataSource={tableData}
      pagination={{
        current,
        total,
        pageSize,
        onChange: index => {
          setCurrent(index);
        },
      }}
    />
  );
};

export default PatrolPeopleTable;
