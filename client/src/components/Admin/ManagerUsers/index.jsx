import React, { useState, useEffect } from 'react';
import TableUsers from './TableUsers';

import { Row, Col, Button, Modal, Form, Input, DatePicker, Upload, message, Tooltip, Select, Checkbox } from 'antd';
import { AppstoreAddOutlined, UploadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import * as action from '../../../redux/actions';

const { Search } = Input;
const { Option } = Select;


const ManagerUsers = ({ users, handleCreateUser }) => {

    // modal add user
    const [modalStyle, setModalStyle] = useState({
        visible: false,
        loading: false,
    });
    const { visible, loading } = modalStyle;
    const [form] = Form.useForm();

    const showModalAddUser = async() => {
        await form.setFieldsValue({
            username: "",
            password: "",
            confirm: "",
            name: "",
            phone:"",
            address: "",
            agreement: false
        });
        
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

    const onFinish = async(values) => {
        await handleCreateUser(JSON.parse(localStorage.getItem('token')).token, values);
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
        }, 1000);
    };
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
            span: 24,
            offset: 0,
            },
            sm: {
            span: 16,
            offset: 8,
            },
        },
    };
    
    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
        <Select style={{ width: 70 }}>
            <Option value="86">+84</Option>
            <Option value="87">+87</Option>
        </Select>
        </Form.Item>
    );
    const [search, setSearch] = useState("");
    const searchByName = (value) => {
        setSearch(value);
    }

    // end modal add user
    return (
        <div className="manager__users">
            <h1>Quản lý người dùng</h1>
            <div className="manager__users__control">
                <Row gutter={[16,16]}>
                    <Col span={18}>
                        <Search placeholder="Nhập tên người dùng cần tìm" onSearch={searchByName} enterButton size="large"/>
                    </Col>
                    <Col span={6}>
                        <Button type="primary" danger shape="round" icon={<AppstoreAddOutlined />} size="large" style={{width:'90%',marginLeft:'10%'}} onClick={showModalAddUser}>
                            THÊM HỌC VIÊN
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <TableUsers searchText={search}/>
                    </Col>
                </Row>
            </div>
            <Modal
                title="Thêm người dùng"
                visible={visible}
                footer=""
                onCancel={handleCancel}
                className="modal__addUser"
                >
               <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    initialValues={{
                        prefix: '84',
                    }}
                    scrollToFirstError
                >
                    <Form.Item
                        name="username"
                        label="Tên tài khoản"
                        rules={[
                        {
                            type: 'string',
                            message: 'Vui lòng nhập tên tài khoản!',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập tên tài khoản!',
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu!',
                        },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="Xác thực mât khẩu"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập lại mật khẩu!',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject('Xác thực không chính xác!');
                            },
                        }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="Họ tên"
                        rules={[
                        {
                            type: 'string',
                            message: 'Vui lòng nhập họ tên!',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập họ tên!',
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                        <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                        rules={[
                        {
                            type: 'string',
                            message: 'Vui lòng nhập địa chỉ!',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập địa chỉ!',
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                        { validator:(_, value) => value ? Promise.resolve() : Promise.reject('Should accept agreement') },
                        ]}
                        {...tailFormItemLayout}
                    >
                        <Checkbox>
                        I have read the <Link to="">agreement</Link>
                        </Checkbox>
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button key="back" onClick={handleCancel}>
                            Thoát
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Tạo
                        </Button>
                    </Form.Item>
                </Form>
           </Modal>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        users: state.users
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        handleCreateUser: (token, data) => {
            dispatch(action.createUserAPI(token, data));
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ManagerUsers);
