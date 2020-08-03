import React,{useState, useEffect} from 'react';

import {
    Form,
    Input,
    Select,
    Checkbox,
    Button,
    message
} from 'antd';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import {API} from '../../API/api';

export const RegisterComponent = () => {
    const [loadingStyle, setLoadingStyle] = useState(false);
    const [messageSignUp, setMessageSignUp] = useState("");
    const { Option } = Select;

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

    const [form] = Form.useForm();


    const success = () => {
        message.success('Tạo tài khoản thành công');
    };
    const error = () => {
        message.error('Tài khoản đã tồn tại!');
    };

    const onFinish = values => {
        setMessageSignUp("");
        axios({
            method:"POST",
            url:`${API}/signup`,
            data: values
        }).then(res => {
            console.log(res.data.message);
            if(res.data.message === 'success') {
                success();
                setMessageSignUp(res.data.message);
            } else {
                error();
            }
        }).catch(err => console.log(err));
        setLoadingStyle(true);
        setTimeout(() => {
            setLoadingStyle(false);
        }, 2000);
    };

    const handleRedirect = () => {
        return <Redirect to="/signin" />
    }
    if(messageSignUp === 'success') return handleRedirect();
    
    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
        <Select style={{ width: 70 }}>
            <Option value="86">+84</Option>
            <Option value="87">+87</Option>
        </Select>
        </Form.Item>
    );

    return (
        <div className="register">
            <div className="register__wrapper">
                <h1>Đăng ký</h1>
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
                            {
                                pattern:new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"),
                                message: 'Mật khẩu có ít nhất 8 ký tự, gồm 1 chữ viết hoa, 1 số và 1 ký tự đặc biệt'
                            }
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
                        <Input />
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
                        { validator:(_, value) => value ? Promise.resolve() : Promise.reject('Bạn chưa xác nhận điều khoản') },
                        ]}
                        {...tailFormItemLayout}
                    >
                        <Checkbox>
                        Tôi đã đọc <Link to="">điều khoản</Link>
                        </Checkbox>
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" loading={loadingStyle}>
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
};
