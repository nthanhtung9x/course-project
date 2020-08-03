import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import * as action from '../../../redux/actions';

import { Descriptions } from 'antd';
import axios from 'axios';
import {API} from '../../../API/api';


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
            console.log(res.data);
            setDetail({...res.data.detailUser});
        }).catch(err => console.log(err));
    }

    useEffect(() => getDetailUser(),[]);

    return (
        <div className="profile__detail">
             <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                <Descriptions.Item label="Tên tài khoản">{detail.username}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{detail.phone}</Descriptions.Item>
                <Descriptions.Item label="Họ Tên">{detail.name}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                    {detail.address}
                </Descriptions.Item>
                <Descriptions.Item label="Quyềnt">{detail.roleName}</Descriptions.Item>
            </Descriptions>
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
