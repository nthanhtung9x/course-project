import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, Select, message, Tooltip, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import * as action from '../../../../redux/actions';

const TableUsers = ({ users, handleUpdateUser, handleDeleteUser, searchText, userLogin, checkRole }) => {
    const successUpdate = () => {
      message.success('Cập nhật thành công');
    };

    const successDelete = () => {
      message.success('Xóa thành công');
    };
  
    const columns = [
        {
            title: 'Tên tài khoản',
            key: 'userName',
            render: (item) => (
              <Tooltip title={item.id}>
                  <p>{item.username}</p>
              </Tooltip>
            )
        },
        {
          title: 'Họ tên',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: 'Địa chỉ',
          dataIndex: 'address',
          key: 'address',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Quyền người dùng',
            dataIndex: 'idRole',
            key: 'idRole',
            render: (item) => {
              if(item === '0') {
                return <p>Admin</p>
              } else if(item === '2') {
                return <p>Giảng Viên</p>
              } else if(item === '3') {
                return <p>Trợ giảng</p>
              }
              return <p>Học Viên</p>
            }
        },
        {
          title: 'Chức năng',
          key: 'action',
          render: (item, record) => (
            <Space size="middle" style={{width:'100%'}}>
              { checkRole.checkUpdateUser ?
                  <Button type="primary" block onClick={() => showModalUpdateUser(item)}>Chỉnh sửa</Button>
                :
                  <></>
              }
              { checkRole.checkDeleteUser && item.id === userLogin.id ? 
                    <></>
                  : !checkRole.checkDeleteUser ?
                      <></>
                    :
                      <Popconfirm
                        title="Bạn chắc chắn muốn xóa người dùng này?"
                        onConfirm={async() => {
                          await handleDeleteUser(JSON.parse(localStorage.getItem('token')).token,{id:item.id});
                          await successDelete();
                        }}
                        onCancel={(e) => console.log(e)}
                        okText="Có"
                        cancelText="Hủy"
                      >
                        <Button type="primary" danger block>Xóa</Button>
                      </Popconfirm>
              }
            </Space>
          ),
        },
    ];

    const renderUsers = () => {
      let result = [];
      for(let i = 0; i < users.length; i++) {
        let item = {
          key:i,
          ...users[i]
        }
        if(item.name.toLowerCase().trim().indexOf(searchText.toLowerCase().trim()) !== -1) {
          result.push(item);
        }
      }
      return result;
    }
    const data = [...renderUsers()];

  // panigation
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const onSelectChange = selectedRowKeys => {
  //   console.log('selectedRowKeys changed: ', selectedRowKeys);
  //   setSelectedRowKeys({ selectedRowKeys });
  // };
  //   const rowSelection = {
  //     selectedRowKeys,
  //     onChange: onSelectChange,
  //   };
  // console.log(rowSelection);
  // end panigation

  // modal

  const [modalStyle, setModalStyle] = useState({
      visible: false,
      loading: false,
  });
  const { visible, loading } = modalStyle;

  const handleCancel = async() => {
    await form.resetFields();
    setModalStyle({
        ...modalStyle,
        visible: false,
    });
};

  const showModalUpdateUser = async(item) => {
      await form.setFieldsValue({
        idUpdateUser:item.id,
        userNameUpdateUser:item.username,
        nameUpdateUser: item.name,
        passwordUpdateUser: item.password,
        phoneUpdateUser: item.phone,
        addressUpdateUser: item.address,
        roleUpdateUser: item.idRole
      });
      setModalStyle({
          ...modalStyle,
          visible: true,
      });
  };

  const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
      },
  };
  

  const [form] = Form.useForm();

  const onFinish = async(values) => {
      await handleUpdateUser(JSON.parse(localStorage.getItem('token')).token,values);
      setModalStyle({
          ...modalStyle,
          loading: true,
      });
      setTimeout(async() => {
          await setModalStyle({
              ...modalStyle,
              visible: false,
              loading: false,
          });
        await successUpdate();
      }, 1000);
  };

    // end modal

    return (
        <div>
            <Table pagination={{ pageSize: 5 }} size="middle" columns={columns} dataSource={data} className="table__users"/>
            <Modal
                title="Cập nhật người dùng"
                visible={visible}
                footer=""
                onCancel={handleCancel}
                className="modal__updateCourse"
                >
                <Form
                    {...formItemLayout}
                    form={form}
                    name="updateUser"
                    onFinish={onFinish} 
                    scrollToFirstError
                >
                    <Form.Item
                        name="idUpdateUser"
                        hidden
                    >
                    </Form.Item>
                    <Form.Item
                        name="userNameUpdateUser"
                        label="Tên tài khoản"
                        rules={[
                        {
                            type: 'string',
                            message: 'Nhập tên tài khoản',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập tên tài khoản!',
                        },
                        ]}
                    >
                        <Input placeholder="Nhập tên tài khoản"/>
                    </Form.Item>
                    <Form.Item
                        name="passwordUpdateUser"
                        label="Mật khẩu"
                        rules={[
                        {
                            type: 'string',
                            message: 'Nhập mật khẩu',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu!',
                        },
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>
                    <Form.Item
                        name="nameUpdateUser"
                        label="Họ tên"
                        rules={[
                        {
                            type: 'string',
                            message: 'Nhập Tên người dùng',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập Tên người dùng!',
                        },
                        ]}
                    >
                        <Input placeholder="Nhập tên người dùng"/>
                    </Form.Item>
                    <Form.Item
                        name="phoneUpdateUser"
                        label="Số điện thoại"
                        rules={[
                        {
                            type: 'string',
                            message: 'Nhập Số điện thoại',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập Số điện thoại!',
                        },
                        ]}
                    >
                        <Input placeholder="Nhập Số điện thoại"/>
                    </Form.Item>
                    <Form.Item
                        name="addressUpdateUser"
                        label="Địa chỉ"
                        rules={[
                        {
                            type: 'string',
                            message: 'Nhập Địa chỉ',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập Địa chỉ!',
                        },
                        ]}
                    >
                        <Input placeholder="Nhập Địa chỉ" />
                    </Form.Item>
                    <Form.Item 
                      label="Quyền"
                      name="roleUpdateUser"
                    >
                      <Select>
                        <Select.Option value="0">Admin</Select.Option>
                        <Select.Option value="1">Học Viên</Select.Option>
                        <Select.Option value="2">Giảng Viên</Select.Option>
                        <Select.Option value="3">Trợ Giảng</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button key="back" onClick={handleCancel}>
                            Thoát
                        </Button>,
                        <Button htmlType="submit" key="submit" type="primary" loading={loading}>
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    )
}

const mapStateToProps = state => {
  return {
    users: state.users,
    userLogin: state.userLogin,
    checkRole: state.checkRole
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    handleUpdateUser: (token, data) => {
      dispatch(action.updateUserAPI(token, data));
    },
    handleDeleteUser: (token, data) => {
      dispatch(action.deleteUserAPI(token, data));
    } 
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(TableUsers);
