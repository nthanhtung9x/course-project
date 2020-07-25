import React, { useEffect, useState } from 'react';

import { Table, Tooltip } from 'antd';
import { connect } from 'react-redux';

const CommonCourses = ({ courses }) => {
    const [listCourses, setListCourses] = useState([]);
    const renderCourses = () => {
        let result = [];
        for(let i = 0; i < courses.length; i++) {
            let item = {
                key:courses[i]._id,
                ...courses[i]
            }
            result.push(item);
        }
        setListCourses([...result]);
    };

    useEffect(() => {
        renderCourses();
    },[courses.length]);

    const columns = [
        {
            title: 'ID khóa học',
            dataIndex: '_id',
        },
        {
            title: 'Tên khóa học',
            key:'name',
            
            // specify the condition of filtering result
            // here is that finding the name started with `value`
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['descend'],
            render: (item) => (
                <Tooltip title={item.timeStart}>
                    <span>{item.name}</span>
                </Tooltip>
            )
        },
    ];
    
    function onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra);
    }
    return (
        <div className="common__courses">
            <h1>Danh sách khóa học</h1>
            <Table columns={columns} dataSource={listCourses} onChange={onChange} scroll={{ y: 480 }} />
        </div>
    )
}

const mapStateToProps = state => {
    return {
        courses: state.courses
    }
}

export default connect(mapStateToProps)(CommonCourses);
