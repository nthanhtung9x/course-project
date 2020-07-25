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

export const RegisterComponent = () => {
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
            url:'https://courses-project-api.herokuapp.com/signup',
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
                        <Button type="primary" htmlType="submit">
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
};
