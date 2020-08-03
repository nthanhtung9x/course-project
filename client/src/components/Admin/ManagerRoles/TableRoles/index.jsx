import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Row, Col, Button, Table, Input, Space, Select, Form, Modal, Checkbox, message, Popconfirm } from 'antd';
import * as action from '../../../../redux/actions';


const TableRoles = ({ handleGetRoles, roles, handleGetFeatures, features, searchText, UpdateRoleAPI, DeleteRoleAPI }) => {

    useEffect(() => {
        handleGetFeatures(JSON.parse(localStorage.getItem('token')).token);
        handleGetRoles(JSON.parse(localStorage.getItem('token')).token);
    },[]);
    const handleShowFeatures = (item) => {
        let result =[];
        for(let i = 0; i < item.length; i++) {
            for(let j = 0; j < features.length; j++) {
                if(item[i].toString() === features[j]._id.toString()) {
                    result.push(features[j].name);
                    break;
                }
            }
        }
        return result.map((item,index) => {
            return <Select.Option key={index}>{item}</Select.Option>
        });
    }
    const columns = [
        {
            title: 'Tên Chức Vụ',
            dataIndex:'name',
            key: 'name',
        },
        {
          title: 'Danh sách quyền',
          key: 'groupFeature',
          render: (item) => (
            <Select style={{width:'100%',maxWidth:'300px'}}>{ handleShowFeatures(item.groupFeature) }</Select>

            
            )
        },
        {
          title: 'Chức năng',
          key: 'action',
          render: (item, record) => (
            <Space size="middle" style={{width:'100%',textAlign:'center'}}>
                    <Button type="primary" style={{width:'200px'}} onClick={async() => {
                        await showModalUpdateRole(item)
                    }}>Chỉnh sửa</Button>

                    <Popconfirm
                    title="Bạn chắc chắn muốn xóa chức vụ này?"
                    onConfirm={async() => {
                        await DeleteRoleAPI(JSON.parse(localStorage.getItem('token')).token,{id:item._id});
                        await message.success('Xóa thành công');
                    }}
                    onCancel={(e) => console.log(e)}
                    okText="Có"
                    cancelText="Hủy"
                    >
                        <Button type="primary" danger style={{width:'200px'}} >Xóa</Button>

                    </Popconfirm>
            </Space>
          ),
        },
    ];
    const renderUsers = () => {
        let result = [];
        for(let i = 0; i < roles.length; i++) {
          let item = {
            key:i,
            ...roles[i]
          }
          if(item.name.toLowerCase().trim().indexOf(searchText.toLowerCase().trim()) !== -1) {
            result.push(item);
          }
        }
        return result;
    }
    const data = [...renderUsers()];

    // modal update role
    const [modalUpdateStyle, setModalUpdateStyle] = useState({
        visibleUpdate: false,
        loadingUpdate: false,
    });
    const { visibleUpdate, loadingUpdate } = modalUpdateStyle;
    
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

    const customOption = () => {
        let arr = [];
        for(let i = 0; i < features.length; i++) {
            let item = {
                label: features[i].name,
                value: features[i]._id
            };
            arr.push(item);
        }
        return arr;
    };

    const [roleUpdate, setRoleUpdate] = useState();



    const plainOptions = [...customOption()]

    const showModalUpdateRole = async(item) => {      
        let arr = [];
        for(let i = 0; i < item.groupFeature.length; i++) {
            let temp = item.groupFeature[i];
            for(let j = 0; j < customOption().length; j++) {
                if(temp.toString() === customOption()[j].value.toString()) {
                    arr.push(customOption()[j].value);
                    break;
                }
            }
        };

        await form.setFieldsValue({
            idUpdateRole: item._id,
            nameUpdateRole: item.name,
            idRole: item.idRole,
            ['groupUpdateFeature']: arr
        })
        await setModalUpdateStyle({
            ...modalUpdateStyle,
            visibleUpdate: true,
        });
    };

    const handleCancel = () => {
        setModalUpdateStyle({
            ...modalUpdateStyle,
            visibleUpdate: false,
        });
    };


    const handleUpdate = values => {
        UpdateRoleAPI(JSON.parse(localStorage.getItem('token')).token, values);
        setModalUpdateStyle({
            ...modalUpdateStyle,
            loadingUpdate: true,
        });
        setTimeout(() => {
            setModalUpdateStyle({
                ...modalUpdateStyle,
                visibleUpdate: false,
                loadingUpdate: false,
            });
        }, 2000);
    };

    useEffect(() => console.log(roleUpdate))
    // end modal update role


    // modal delete role


    // end modal delete role
    return (
        <>
            <Table pagination={{ pageSize: 5 }} size="middle" columns={columns} dataSource={data} className="table__users"/>
        
            {/* modal update role */}
            <Modal
                title="Cập nhật chức vụ"
                visible={visibleUpdate}
                footer=""
                onCancel={handleCancel}
                className="modal__addRole"
                >
                <Form
                    {...formItemLayout}
                    form={form}
                    name="form__updateRole"
                    onFinish={handleUpdate} 
                    scrollToFirstError

                >
                    <Form.Item
                            name="idUpdateRole"
                            hidden
                        >
                    </Form.Item>
                    <Form.Item
                            name="idRole"
                            hidden
                        >
                    </Form.Item>
                    <Form.Item
                        name="nameUpdateRole"
                        label="Tên chức vụ"
                        rules={[
                        {
                            type: 'string',
                            message: 'Nhập tên tên chức vụ',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập tên tên chức vụ!',
                        },
                        ]}
                    >
                        <Input placeholder="Nhập tên chức vụ"/>
                    </Form.Item>
                    <Form.Item name="groupUpdateFeature" label="Chức năng" rules={[
                        {
                            type: 'array',
                            message: 'Vui lòng chọn chức năng',
                        },
                        ]}>
                        <Checkbox.Group options={plainOptions} />
                    </Form.Item>
                    <Form.Item>
                        <Button key="back" onClick={handleCancel}>
                            Thoát
                        </Button>
                        <Button htmlType="submit" key="submit" type="primary" loading={loadingUpdate}>
                            Thêm
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
  
        </>
    )
}

const mapStateToProps = state => {
    return {
        roles: state.rolesStore,
        features: state.featuresStore
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        handleGetRoles: (token) => {
            dispatch(action.getRolesAPI(token));
        },
        handleGetFeatures: (token) => {
            dispatch(action.getFeaturessAPI(token));
        },
        UpdateRoleAPI: (token, data) => {
            dispatch(action.UpdateRoleAPI(token, data));
        },
        DeleteRoleAPI: (token, data) => {
            dispatch(action.DeleteRoleAPI(token, data));
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(TableRoles);
