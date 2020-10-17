import React, { useState, useEffect } from 'react';

import { Select, Row, Col, Button, Modal, Form, Input, DatePicker, Upload, message, Spin } from 'antd';
import { AppstoreAddOutlined, LoadingOutlined } from '@ant-design/icons';

import moment from 'moment';

import CourseItem from './CourseItem';
import { connect } from 'react-redux';
import * as action from '../../../redux/actions';
import axios from 'axios';
import { API } from '../../../API/api';

const { Option } = Select;

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const ManagerCourses = ({ courses, createCourseAPI, checkRole }) => {
    const [isLoading, setLoading] = useState(true);


    // modal
    const [modalStyle, setModalStyle] = useState({
        visible: false,
        loading: false,
    });
    const { visible, loading } = modalStyle;
    const dateFormat = 'DD/MM/YYYY';

    const [teacherList, setTeacherList] = useState([]);

    const getTeacher = (token) => {
        return axios({
            url: `${API}/getTeacher`,
            method: 'GET',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
        }).then(res => {
            setTeacherList([...res.data.teachers]);
        }).catch(err => console.log(err))
    };

    const renderTeacher = () => {
        return teacherList.map((item, index) => {
            return <Select.Option value={item._id} key={index}>{item.name}</Select.Option>
        })
    };

    const showModalAddCourse = () => {
        getTeacher(JSON.parse(localStorage.getItem('token')).token);
        setModalStyle({
            ...modalStyle,
            visible: true,
        });
    };

    const handleCancel = () => {
        setModalStyle({
            ...modalStyle,
            visible: false,
        });
    };

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 7 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 17 },
        },
    };

    const [form] = Form.useForm();


    const onFinish = values => {
        console.log('Received values of form: ', values['dateCourse'].format('DD/MM/YYYY'));
        createCourseAPI(JSON.parse(localStorage.getItem('token')).token, {
            ...values,
            dateCourse: values['dateCourse'].format('DD/MM/YYYY')
        });

        setModalStyle({
            ...modalStyle,
            loading: true,
        });
        setTimeout(() => {
            setModalStyle({
                ...modalStyle,
                visible: false,
                loading: false,
            });
        }, 2000);
    };

    useEffect(() => {
        renderCourses();
    }, [courses.length]);

    // end Modal

    const [searchType, setSeachType] = useState("");

    const onChange = (value) => {
        console.log(`selected ${value}`);
        setSeachType(value);
    };

    const renderNameCourse = () => {
        return courses.map((item, index) => {
            return <Option value={item.name} key={index}>{item.name}</Option>
        })
    }

    const onChangeName = (value) => {
        setSeachType(value);
    };

    const renderCourses = () => {
        if (searchType !== "FE" && searchType !== "BE") {
            return courses.map((item, index) => {
                if (item.name.toLowerCase().trim().indexOf(searchType.toLowerCase().trim()) !== -1) {
                    return <Col xs={{ span: 24 }} md={{ span: 8 }} xl={{ span: 6 }} xxl={{ span: 4 }} key={index}>
                        <CourseItem item={item} />
                    </Col>
                }
            })
        }
        return courses.map((item, index) => {
            if (item.type.toLowerCase().trim().indexOf(searchType.toLowerCase().trim()) !== -1) {
                return <Col xs={{ span: 24 }} md={{ span: 8 }} xl={{ span: 6 }} xxl={{ span: 4 }} key={index}>
                    <CourseItem item={item} />
                </Col>
            }
        })
    };

    useEffect(() => {
        if (courses.length > 0) {
            setLoading(false);
        }
    }, [courses.length]);

    return (
        <div className="manager__courses">
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

            <h1>QUẢN LÝ KHÓA HỌC</h1>
            <div className="manager__courses__control">
                <Row gutter={[16, 16]}>
                    <Col xs={{ span: 24 }} md={{ span: 9 }}>
                        <Select
                            showSearch
                            placeholder="Tìm kiếm theo loại"
                            optionFilterProp="children"
                            onChange={onChange}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            className="search__courses"
                            size="large"
                        >
                            <Option value="">Tất cả</Option>
                            <Option value="FE">Front-End</Option>
                            <Option value="BE">Back-End</Option>
                        </Select>
                    </Col>
                    <Col xs={{ span: 24 }} md={{ span: 9 }}>
                        <Select
                            showSearch
                            placeholder="Tìm kiếm theo tên"
                            optionFilterProp="children"
                            onChange={onChangeName}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            className="search__courses"
                            size="large"
                        >
                            <Option value="">Tất cả</Option>
                            {renderNameCourse()}
                        </Select>
                    </Col>
                    <Col xs={{ span: 24 }} md={{ span: 6 }}>
                        {checkRole.checkAddCourse ?
                            <Button type="primary" danger shape="round" icon={<AppstoreAddOutlined />} size="large" style={{ width: '90%', marginLeft: '10%' }} onClick={showModalAddCourse}>
                                THÊM KHÓA HỌC
                            </Button>
                            :
                            <></>
                        }
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    {renderCourses(searchType)}
                </Row>
            </div>

            <Modal
                title="Thêm khóa học"
                visible={visible}
                footer=""
                onCancel={handleCancel}
                className="modal__addCourse"
            >
                <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    scrollToFirstError
                >
                    <Form.Item
                        name="nameCourse"
                        label="Tên khóa học"
                        rules={[
                            {
                                type: 'string',
                                message: 'Nhập tên khóa học',
                            },
                            {
                                required: true,
                                message: 'Vui lòng nhập tên khóa học!',
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên khóa học" />
                    </Form.Item>
                    <Form.Item
                        name="typeCourse"
                        label="Loại khóa học"
                        rules={[
                            {
                                type: 'string',
                                message: 'Chọn loại khóa học',
                            },
                            {
                                required: true,
                                message: 'Vui lòng chọn loại khóa học!',
                            },
                        ]}
                    >
                        <Select placeholder="Chọn loại khóa học">
                            <Select.Option value="FE">Front-End</Select.Option>
                            <Select.Option value="BE">Back-End</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="dateCourse"
                        label="Thời gian tạo"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn thời gian cụ thể!',
                            }
                        ]}
                    >
                        <DatePicker format={dateFormat} defaultValue={moment(new Date(), dateFormat)} />
                    </Form.Item>
                    <Form.Item name="uploadCourse" label="Hình ảnh" rules={[
                        {
                            type: 'string',
                            message: 'Chọn hình ảnh',
                        },
                        {
                            required: true,
                            message: 'Vui lòng chọn hình ảnh!',
                        },
                    ]}>
                        <Input placeholder="Nhập link ảnh" />
                    </Form.Item>
                    <Form.Item name="descCourse" label="Mô tả" rules={[
                        {
                            type: 'string',
                            message: 'Nhập mô tả khóa học',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập mô tả khóa học!',
                        },
                    ]}>
                        <Input placeholder="Nhập mô tả khóa học" />
                    </Form.Item>
                    <Form.Item name="authorCourse" label="Giảng viên" rules={[
                        {
                            type: 'string',
                            message: 'Chọn giảng viên',
                        },
                        {
                            required: true,
                            message: 'Vui lòng chọn giảng viên!',
                        },
                    ]}>
                        <Select placeholder="Chọn giảng viên">
                            {renderTeacher()}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button key="back" onClick={handleCancel}>
                            Thoát
                        </Button>
                        <Button htmlType="submit" key="submit" type="primary" loading={loading}>
                            Tạo
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        courses: state.courses,
        checkRole: state.checkRole
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        createCourseAPI: (token, data) => {
            dispatch(action.createCourseAPI(token, data));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManagerCourses);
