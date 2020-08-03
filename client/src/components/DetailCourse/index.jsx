import React, { useEffect, useState } from 'react';
import { Row, Col, message, Modal  } from 'antd';
import CourseItem from '../CourseItem';

import { connect } from 'react-redux';
import * as action from '../../redux/actions';

import { SmallDashOutlined } from '@ant-design/icons';
import { Link, Redirect, useHistory } from 'react-router-dom';

const DetailCourse = ({ detailCourse, getFindCourseById, match, userLogin, actionRegisterCourse, registerCourse, setDefaultRegisterCourse }) => {
    const successRegister =() => {
        message.success('Ghi danh thành công, chờ xét duyệt !');
    }
    const errorRegister =() => {
        message.error('Bạn đã ghi danh khóa học này');
    }
    useEffect(() => {
        setDefaultRegisterCourse();
        getFindCourseById(match.params.id);
        setVisible(false);
    },[]);

    // useEffect(() => {
        
    // },[registerCourse]);

    const handleRegisterCourse = async(data) => {
        if(userLogin.username) {
            await actionRegisterCourse(JSON.parse(localStorage.getItem('token')).token,data);
            if(registerCourse === false) {
                await errorRegister();
            }  else if(registerCourse) {
                await successRegister();
                
            }
        } else {
            showModal();
        }
    }

    const [visible, setVisible] = useState(false);
    const history = useHistory();
    
    const showModal = async() => {
        setVisible(true);
    };
    
    const hideModal = () => {
        setVisible(false);
    };

    return (
        <>
            {
                detailCourse._id ?
                        <div className="DetailCourse">
                            <div className="DetailCourse__wrapper">
                                <Row gutter={16}>
                                    <Col className="gutter-row" xs={{span:24}} md={{span:16}}>
                                        <div className="DetailCourse__content">
                                            <h1 className="detail__name">{detailCourse.name}</h1>
                                            <p className="detail__subcribe">{detailCourse.description}</p>
                                            <p className="detail__subcribe">Tác giả: {detailCourse.author}</p>
                                            <p className="detail__rating">
                                                Đánh giá:
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                            </p>
                                            <p className="detail__subcribe">Thời gian cập nhật mới nhất: {detailCourse.timeStart}</p>
                                            <div className="detail__description">
                                                <h4>Bạn sẽ học được gì?</h4>
                                                <ul className="detail__description__list">
                                                    <li>
                                                        <span>
                                                            <i className="fa fa-check-circle"></i>
                                                        </span>
                                                        <span>
                                                            Nắm được cách hoạt động của {detailCourse.name}.
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <span>
                                                            <i className="fa fa-check-circle"></i>
                                                        </span>
                                                        <span>
                                                            Dễ dàng xây dựng giao diện 1 cách nhanh chóng.
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                            
                                            <div className="detail__course-other">
                                                <h4>1 số khóa học khác:</h4>
                                                <Row gutter={[{ xs: 8, sm: 16, md: 16 },{xs: 8, sm: 16, md: 16}]}>
                                                    <Col xs={{span:12}} xl={{span:8}} className="gutter-row">
                                                        {/* <CourseItem/> */}
                                                    </Col>
                                                    <Col xs={{span:12}} xl={{span:8}} className="gutter-row">
                                                        {/* <CourseItem/> */}
                                                    </Col>
                                                    <Col xs={{span:12}} xl={{span:8}} className="gutter-row">
                                                        {/* <CourseItem/> */}
                                                    </Col>
                                                </Row>
                                                <Link to="/courses" className="btn-back">
                                                    <SmallDashOutlined />
                                                </Link>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" xs={{span:24}} md={{span:8}}>
                                        <div  className="DetailCourse__control">
                                            <div className="DetailCourse__control__img">
                                                <img src={detailCourse.image} alt={detailCourse.image}></img>
                                            </div>
                                            <div className="DetailCourse__control__content">
                                                {/* <p className="detail__price">
                                                    <span className="detail__price-new">{detailCourse.price} VNĐ</span>
                                                    <span className="detail__price-old">800.000 VNĐ</span>
                                                </p> */}
                                                {/* <button className="btn-cart">Thêm vào giỏ hàng</button> */}
                                                {   registerCourse ? 
                                                        <button 
                                                            className="btn-buy outline"
                                                            disabled>
                                                        Đã ghi danh</button>
                                                    :
                                                        <button 
                                                            className="btn-buy ant-btn-danger" 
                                                            onClick={() => {
                                                                handleRegisterCourse({
                                                                    idCourse: detailCourse._id,
                                                                    idUser: userLogin.id
                                                                })
                                                        }}>Ghi danh</button>
                                                }
                                                <p>Khóa học bao gồm</p>
                                                <ul>
                                                    <li>
                                                        <span>
                                                            <i className="fa fa-clock"></i>
                                                        </span>
                                                        <span>
                                                            48 giờ học
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <span>
                                                            <i className="fa fa-file-video"></i>
                                                        </span>
                                                        <span>
                                                            22 video
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    :
                        <h1 style={{marginTop:'120px'}}>Không tìm thấy</h1>
            }
            <Modal
                title="TCREATION"
                visible={visible}
                onOk={async() => {
                    await setVisible(false);
                    await history.push('/signin');
                }}
                onCancel={hideModal}
                okText="Đăng nhập"
                cancelText="Thoát"
            >
                <p style={{textAlign:'center'}}>Vui lòng đăng nhập để ghi danh khóa học</p>
            </Modal>
        </>
           
    )
}

const mapStateToProps = state => {
    return {
        detailCourse: state.detailCourse,
        userLogin: state.userLogin,
        registerCourse: state.registerCourse
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getFindCourseById: (id) => {
            dispatch(action.findCourseById(id));
        },
        actionRegisterCourse: (token, data) => {
            dispatch(action.registerCourseAPI(token,data));
        },
        setDefaultRegisterCourse: () => {
            dispatch(action.setDefaultRegisterCourse());
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(DetailCourse);
