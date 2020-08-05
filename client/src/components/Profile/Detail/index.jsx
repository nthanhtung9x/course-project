import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import * as action from '../../../redux/actions';

import { Descriptions, Button, Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';
import {API} from '../../../API/api';
const { Option } = Select;


const ProfileDetail = ({ userLogin, profile }) => {
    const [detail, setDetail] = useState({});

    const getDetailUser = () => {
        axios({
            url:`${API}/getDetailUser`,
            method:'GET',
            headers: {
                'Authorization': JSON.parse(localStorage.getItem('token')).token,
                "Content-Type": "application/json",
            }
        }).then(res => {
            setDetail({...res.data.detailUser});
        }).catch(err => console.log(err));
    }

    useEffect(() => getDetailUser(),[]);

    // modal 
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 18 },
        },
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
    const [loadingStyle, setLoadingStyle] = useState(false);
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();

    const showModal = async(detail) => {
        await form.setFieldsValue({
            id: detail._id,
            username: detail.username,
            password: detail.password,
            confirm: detail.password,
            name: detail.name,
            phone: detail.phone,
            address: detail.address
        })
        await setVisible(true);
    }

    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
        <Select style={{ width: 70 }}>
            <Option value="86">+84</Option>
            <Option value="87">+87</Option>
        </Select>
        </Form.Item>
    );

    const onFinish = async(data) => {
        console.log(data);
        axios({
            url:`${API}/updateDetailUser`,
            method:'PUT',
            headers: {
                'Authorization': JSON.parse(localStorage.getItem('token')).token,
                "Content-Type": "application/json",
            },
            data
        }).then(res => {
            setDetail({...res.data.detailUser});
            if(res.data.detailUser) {
                message.success('Cập nhật thành công');
            } else {
                message.error('Cập nhật thất bại');
            }
        }).catch(err => console.log(err));

        await setLoadingStyle(true);
        setTimeout(() => {
            setLoadingStyle(false);
            setVisible(false);
        }, 2000);

    }

    const handleCancel = () => {
        setVisible(false);
    }

    return (
        <div className="profile__detail">
             <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                <Descriptions.Item label="Tên tài khoản">{detail.username}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{detail.phone}</Descriptions.Item>
                <Descriptions.Item label="Họ Tên">{detail.name}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                    {detail.address}
                </Descriptions.Item>
                <Descriptions.Item label="Quyền">{detail.roleName}</Descriptions.Item>
                <Descriptions.Item label="Mật khẩu">{detail.password}</Descriptions.Item>

            </Descriptions>
            <Button size="large" className="ant-btn ant-btn-primary" style={{margin:'12px'}} onClick={() => {
                showModal(detail)
            }}>Chỉnh sửa thông tin</Button>
            <Modal
                title="Chỉnh sửa thông tin cá nhân"
                className="modal__update"
                visible={visible}
                footer=""
                onCancel={handleCancel}
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
                        name="id"
                        hidden
                    >
                    </Form.Item>

                    <Form.Item
                        name="username"
                        label="Tên tài khoản"
                        rules={[
                        {
                            type: 'email',
                            message: 'Vui lòng nhập tên tài khoản mail',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập tên tài khoản mail',
                        },
                        {
                            min:8,
                            message: 'Tên tài khoản tối thiểu 8 ký tự!'
                        },
                        {
                            max:50,
                            message: 'Tên tài khoản tối đa 50 ký tự'
                        }
                        ]}
                    >
                        <Input placeholder="Nhập tên tài khoản mail"/>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu!',
                            },
                            {
                                pattern:new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"),
                                message: 'Mật khẩu có ít nhất 8 ký tự, gồm 1 chữ viết hoa, 1 số và 1 ký tự đặc biệt'
                            }
                        ]}
                        hasFeedback
                    >
                        <Input.Password placeholder="Nhập mật khẩu"/>
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="Xác thực"
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
                        <Input.Password placeholder="Nhập lại mật khẩu"/>
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
                        {
                            min:8,
                            message: 'Họ tên tối thiểu 8 ký tự!'
                        },
                        {
                            max:50,
                            message: 'Họ tên tối đa 50 ký tự'
                        }
                        ]}
                    >
                        <Input placeholder="Nhập họ tên"/>
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                            { 
                                required: true, 
                                message: 'Vui lòng nhập số điện thoại!' 
                            },
                            {
                                pattern: new RegExp("^[0-9]+$"),
                                message: "Số điện thoại chỉ được nhập số!"
                            }        
                        ]}
                    >
                        <Input addonBefore={prefixSelector} style={{ width: '100%' }} placeholder="Nhập số điện thoại"/>
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
                        <Input placeholder="Nhập địa chỉ"/>
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" size="large" loading={loadingStyle}>
                            Sửa
                        </Button>
                    </Form.Item>
                </Form>
         
            </Modal>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        userLogin: state.userLogin,
        profile: state.profile
    }
}

export default connect(mapStateToProps)(ProfileDetail);
