import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API } from '../../API/api';
import { Redirect, useHistory } from 'react-router-dom';

const AuthenticationPassword = () => {
    const [loadingStyle, setLoadingStyle] = useState(false);

    const onFinish = data => {
        data.username = data.username.toLowerCase().trim();
        axios({
            method:"POST",
            url:`${API}/getPassword`,
            headers: {
                "Content-Type": "application/json",
            },
            data
        }).then(async(res) => {
            if(res.data.message) {
                await message.success('Đã gửi thông tin đến Mail thành công');
            } else {
                message.error('Gửi mail xác thực không hợp lệ');
            }
        }).catch(err => console.log(err));

        setLoadingStyle(true);
        setTimeout(() => {
            setLoadingStyle(false);
            backLogin();
        }, 3000);
    }
    const history = useHistory();
    const backLogin = () => {
        history.push("/signin");
    };

    return (
        <div className="login">
            <div className="login__wrapper">
                <h1>Quên mật khẩu</h1>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tài khoản mail!' },
                            { 
                                type: 'email',
                                message: "Mail không hợp lệ"
                            }    
                        ]}
                    >
                        <Input size="large" prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Nhập tài khoản mail" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" className="login-form-button" loading={loadingStyle}>
                            Gửi mail
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default AuthenticationPassword;
