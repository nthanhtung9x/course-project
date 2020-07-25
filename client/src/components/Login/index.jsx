import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import * as actions from '../../redux/actions/index';
import axios from 'axios';

const LoginComponent = ({handleLogin}) => {
    const successLogin = () => {
        message.success('Đăng nhập thành công');
    }

    const errorLogin = () => {
        message.error('Tài khoản hoặc mật khẩu không đúng');
    }

    const onFinish = values => {
        axios({
            method:"POST",
            url:'https://courses-project-api.herokuapp.com/signin',
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                username: values.username,
                password: values.password
            }
        })
        .then(res => {
            if(res.data.token) {
                localStorage.setItem('token',JSON.stringify(res.data));
                handleLogin(res.data.token);
                successLogin();
                return <Redirect to="/"/>
            }
            return errorLogin();
        })
        .catch(err => {
            console.log(err);
        });
    };

    return (
        <div className="login">
            <div className="login__wrapper">
                <h1>Đăng nhập</h1>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nhập tên tài khoản" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Nhập mật khẩu"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Link className="login-form-forgot" to="/">
                        Quên mật khẩu?
                        </Link>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                        Đăng nhập
                        </Button>
                        Hoặc <Link to="/signup">Đăng ký ngay!</Link>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        handleLogin: (token) => {
            dispatch(actions.checkUser(token));
        }
    }
};

export default connect(null, mapDispatchToProps)(LoginComponent);