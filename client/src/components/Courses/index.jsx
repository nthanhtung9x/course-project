import React, { useEffect, useState } from 'react';
import CourseItem from '../CourseItem';

import { connect } from 'react-redux';

import { Row, Col, Input, Pagination } from 'antd';
const { Search } = Input;

const CoursesComponent = ({ getCourse, courses }) => {

    const [searchText, setSearchText] = useState("");    
    const renderCourses = (min, max) => {

        let showCountCoursePerPage = courses.slice(min,max);
        console.log(showCountCoursePerPage);
        return showCountCoursePerPage.map((item,index) => {
            if(item.name.toLowerCase().trim().indexOf(searchText.toLowerCase().trim()) !== -1) {
                return <Col key={index} xs={{span:12}} md={{span:8}} xl={{span:6}} xxl={{span:4}} className="gutter-row">
                            <CourseItem item={item} />
                        </Col>
            }
        })
    }
    const numEachPage = 8;
    const [customPage, setCustomPage] = useState({
        min: 0,
        max: 8
    })
    const handlePanigation = (value) => {
        setCustomPage({
            min: (value - 1) * numEachPage,
            max: value * numEachPage
        })
    }

    return (
        <div className="courses">
            <div className="courses__wrapper">
                <div className="courses__wrapper-top">
                    <h1>Danh sách khóa học</h1>
                    <Search
                        placeholder="Nhập tên khóa học cần tìm"
                        enterButton="Search"
                        size="large"
                        onSearch={value => setSearchText(value)}
                    />
                </div>
                <div className="courses__wrapper-main">
                    <Row gutter={[{ xs: 8, sm: 16, md: 16 },{xs: 8, sm: 16, md: 16}]}>
                        { renderCourses(customPage.min,customPage.max) }
                    </Row>
                    <Pagination defaultCurrent={1} defaultPageSize={numEachPage} total={courses.length} onChange={handlePanigation}/>
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = state => {
    return {
        courses: state.courses
    }
}



export  default connect(mapStateToProps)(CoursesComponent);