import React, { useEffect, useState } from 'react';

import { Row, Col } from 'antd';
import {
    BookOutlined,
    UserOutlined,
    CodepenOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import CommonUsers from './UsersCommon';
import CommonCourses from './CoursesCommon';



const AdminCommon = ({ courses, users }) => {
    const [memberList, setMemberList] = useState([]);
    const [teacherList, setTeacherList] = useState([]);

    const countMember = () => {
        let result = users.filter(item => {
            return item.idRole === "1";
        })
        setMemberList([...result])
    };

    const countTeacher = () => {
        let result =  users.filter(item => {
            return item.idRole === "2";
        })
         setTeacherList([...result])
    }

    useEffect(() => {
        countMember();
        countTeacher();
    },[users]);


    return (
        <div className="common">
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <div className="common__item">
                        <BookOutlined />
                        <p>{courses.length} Khóa học</p>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="common__item">
                        <UserOutlined />
                        <p>{memberList.length} Học viên</p>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="common__item">
                        <CodepenOutlined />
                        <p>{teacherList.length} Giảng viên</p>
                    </div>
                </Col>
            </Row>
            <Row gutter={[16,16]}>
                <Col span={14}>
                    <CommonUsers/>
                </Col>
                <Col span={10}>
                    <CommonCourses/>
                </Col>
            </Row>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        courses: state.courses,
        users: state.users
    }
}


export default connect(mapStateToProps)(AdminCommon);
