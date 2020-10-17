import React, { useState, useEffect } from 'react';

import { Spin, Table } from 'antd';
import { connect } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;


const CommonUsers = ({ users }) => {
    const [isLoading, setLoading] = useState(true);

    const [listMember, setListMember] = useState([]);
    const renderMembers = () => {
        let temp = users.filter(item => {
            return item.idRole === "1";
        })
        let result = [];
        for (let i = 0; i < temp.length; i++) {
            let item = {
                key: i,
                ...temp[i]
            }
            result.push(item);
        }
        setListMember([...result]); 
    };

    useEffect(() => {
        renderMembers();
    }, [users.length]);

    useEffect(() => {
        if(listMember.length > 0) {
            setLoading(false);
        }
    },[listMember.length]);

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
        <>
            {
                isLoading && <div className="overlay__wrapper">
                    <Spin
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%,-50%)'
                        }}
                        tip="Loading..."
                        size="large"
                        indicator={antIcon}
                    >
                    </Spin>
                </div>
            }
            {
                !isLoading &&  <div className="common__users">
                <h1>Danh sách học viên</h1>
                <Table columns={columns} dataSource={listMember} onChange={onChange} scroll={{ y: 480 }} />
            </div>
            }
           
        </>
    )
}

const mapStateToProps = state => {
    return {
        users: state.users
    }
}

export default connect(mapStateToProps)(CommonUsers);
