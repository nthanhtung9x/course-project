import React, { useState, useEffect } from 'react';

import { Table } from 'antd';
import { connect } from 'react-redux';


const CommonUsers = ( {users} ) => {
    const [listMember, setListMember] = useState([]);
    const renderMembers = () => {
        let temp = users.filter(item => {
            return item.idRole === "1";
        })
        let result = [];
        for(let i = 0; i < temp.length; i++) {
            let item = {
                key:i,
                ...temp[i]
            }
            result.push(item);
        }
        setListMember([...result]);
    };

    useEffect(() => {
        renderMembers();
    },[users.length]);
    
    const columns = [
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            // specify the condition of filtering result
            // here is that finding the name started with `value`
            onFilter: (value, record) => record.name.indexOf(value) === 0,
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['descend'],
        },
        {
            title: 'Email',
            dataIndex: 'username',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.username.length - b.username.length
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone - b.phone,
            sortDirections: ['descend', 'ascend'],
        },
    ];
    
    function onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra);
    }

    return (
        <div className="common__users">
            <h1>Danh sách học viên</h1>
            <Table columns={columns} dataSource={listMember} onChange={onChange} scroll={{ y: 480 }} />
        </div>
    )
}

const mapStateToProps = state => {
    return {
        users: state.users
    }
}

export default connect(mapStateToProps)(CommonUsers);
