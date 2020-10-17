import React, { useEffect, useState } from 'react';

import ProfileCourseItem from './CourseItem';
import { connect } from 'react-redux';
import * as action from '../../../redux/actions';
import { LoadingOutlined } from '@ant-design/icons';

import { Row, Col, Input, DatePicker, Spin } from 'antd';
const { RangePicker } = DatePicker;
const { Search } = Input;

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;


const ProfileCourses = ({ coursesOfUser, handleGetCoursesOfUser, match, userLogin }) => {
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (coursesOfUser.length > 0) {
            setLoading(false);
        }
    }, [coursesOfUser.length]);

    useEffect(() => {
        handleGetCoursesOfUser(JSON.parse(localStorage.getItem('token')).token);
    }, []);

    const [searchText, setSearchText] = useState("");
    const renderCoursesList = () => {
        if (userLogin.id === match.params.id) {
            return coursesOfUser.map((item, index) => {
                if (item.name.toLowerCase().trim().indexOf(searchText.toLowerCase().trim()) !== -1) {
                    return <Col key={index} xs={{ span: 24 }} md={{ span: 8 }} xl={{ span: 6 }} xxl={{ span: 4 }} className="gutter-row">
                        <ProfileCourseItem item={item} />
                    </Col>
                }
            })
        }
        return <></>;
    }

    return (
        <div className="profile__courses">
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
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" xs={{ span: 24 }} md={{ span: 6 }}>
                    <div className="wall-col">
                        <p className="label-title">Tìm kiếm khóa học:</p>
                        <Search placeholder="Nhập tên khóa học" onSearch={value => setSearchText(value)} enterButton />
                        <p className="label-title">Tìm kiếm khóa học theo thời gian:</p>
                        <RangePicker showTime />
                    </div>
                </Col>
                <Col className="gutter-row" xs={{ span: 24 }} md={{ span: 18 }}>
                    <div className="wall-col">
                        <Row gutter={[{ xs: 8, sm: 16, md: 16 }, { xs: 8, sm: 16, md: 16 }]}>
                            {renderCoursesList()}
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    )
};

const mapStateToProps = state => {
    return {
        coursesOfUser: state.coursesOfUser,
        userLogin: state.userLogin
    }
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        handleGetCoursesOfUser: (token, data) => {
            dispatch(action.getCoursesOfUserAPI(token, data));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileCourses);