import React, { FC, useEffect, useState } from 'react';
import { Button, Card, List, message, Modal } from 'antd';
import { queryRole, deleteRole } from '@/pages/system/user/services/role.service';
import RoleForm from '@/pages/system/user/components/RoleForm';

/**
 *  删除角色
 * @param selectedRows
 * @param cb
 */
const handleRemove = (selectedRows: RoleListForm, cb?: () => void) => {
  Modal.confirm({
    title: '提示',
    content: '是否确认删除该角色',
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      try {
        await deleteRole(selectedRows);
        if (cb) {
          cb.call(null);
        }
        message.success('删除成功');
      } catch (error) {
        message.error('删除失败');
      }
    },
    onCancel() {},
  });
};

interface RoleListProps {}

const RoleList: FC<RoleListProps> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [roleData, setRoleData] = useState<RoleListItem[]>([]);
  const [stepFormValues, setStepFormValues] = useState({});

  const refreshRoleList = () => {
    queryRole().then(res => {
      const { data = [] } = res;
      setRoleData(data);
    });
  };

  useEffect(() => {
    refreshRoleList();
  }, []);

  return (
    <>
      <Card
        title="角色"
        extra={
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              handleModalVisible(true);
              setStepFormValues({});
            }}
          >
            新建
          </Button>
        }
        bordered={false}
      >
        <List
          dataSource={roleData}
          renderItem={item => (
            <List.Item
              actions={[
                <Button
                  icon="edit"
                  type="link"
                  onClick={() => {
                    handleModalVisible(true);
                    setStepFormValues({ ...item, id: item.moduleId });
                  }}
                ></Button>,
                <Button
                  icon="delete"
                  type="link"
                  onClick={() => {
                    handleRemove({ id: item.moduleId }, () => {
                      refreshRoleList();
                    });
                  }}
                ></Button>,
              ]}
            >
              <List.Item.Meta title={`${item.name}(${item.count})`} />
              {/* <Typography.Text mark>{item.name}</Typography.Text> */}
            </List.Item>
          )}
        />
      </Card>
      <RoleForm
        onSubmit={async () => {
          refreshRoleList();
          handleModalVisible(false);
        }}
        onCancel={() => handleModalVisible(false)}
        formValue={stepFormValues}
        modalVisible={createModalVisible}
      />
    </>
  );
};

export default RoleList;
