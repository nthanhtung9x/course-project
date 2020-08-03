import React, { useState } from 'react';

import { connect } from 'react-redux';
import * as action from '../../../redux/actions';


import { Row, Col, Button, Input, Form, Modal, Checkbox  } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';
import TableRoles from './TableRoles';
import { Redirect } from 'react-router-dom';
const { Search } = Input;


const ManagerRoles = ({ features, addRoleAPI, checkRole }) => {
     // modal
     const [modalStyle, setModalStyle] = useState({
        visible: false,
        loading: false,
    });
    const { visible, loading } = modalStyle;

    const [searchText, setSearchText] = useState("");

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

    const showModalAddRole = async() => {
        await form.setFieldsValue({
            nameRole: "",
            groupFeature: false
        })
        setModalStyle({
            ...modalStyle,
            visible: true,
        });
    };

    const handleCancel = () => {
        setModalStyle({
            ...modalStyle,
            visible: false,
        });
    };



    const onFinish = values => {
        addRoleAPI(JSON.parse(localStorage.getItem('token')).token, values);
        setModalStyle({
            ...modalStyle,
            loading: true,
        });
        setTimeout(() => {
            setModalStyle({
                ...modalStyle,
                visible: false,
                loading: false,
            });
        }, 2000);
    };

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

    const plainOptions = [...customOption()]

    // end modal

    return (
        <>
            { checkRole.checkManagerRole ?
                    <div className="manager__users">
                <h1>Quản Lý Chức Vụ</h1>
                <div className="manager__users__control">
                    <Row gutter={[16,16]}>
                        <Col span={18}>
                            <Search placeholder="Nhập tên chức vụ cần tìm" enterButton size="large" onSearch={(value) => {
                                setSearchText(value)
                            }}/>
                        </Col>
                        <Col span={6}>
                            <Button type="primary" danger shape="round" icon={<AppstoreAddOutlined />} size="large" style={{width:'90%',marginLeft:'10%'}} onClick={showModalAddRole}>
                                THÊM CHỨC VỤ
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <TableRoles searchText={searchText}/>
                        </Col>
                    </Row>
                </div>
                <Modal
                    title="Thêm chức vụ"
                    visible={visible}
                    footer=""
                    onCancel={handleCancel}
                    className="modal__addRole"
                    >
                    <Form
                        {...formItemLayout}
                        form={form}
                        name="form__addRole"
                        onFinish={onFinish} 
                        scrollToFirstError
                    >
                        <Form.Item
                            name="nameRole"
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
                        <Form.Item name="groupFeature" label="Chức năng" rules={[
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
                            <Button htmlType="submit" key="submit" type="primary" loading={loading}>
                                Thêm
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
    
                
                
            </div>
                :   
                    <Redirect to="/"/>
            }
        </>
    )
}

const mapStateToProps = state => {
    return {
        features: state.featuresStore,
        checkRole: state.checkRole
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        addRoleAPI: (token, data) => {
            dispatch(action.addRoleAPI(token, data))
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ManagerRoles);
