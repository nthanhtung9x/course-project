import React, {useEffect, useState} from 'react';

import { Link } from "react-router-dom";

import Logo from "../../images/logo.jpg";

import { connect } from 'react-redux';
import * as action from '../../redux/actions';

import { Select } from 'antd';
const { Option } = Select;

const HeaderComponent = ({ userLogin, logOut, findUser, checkRole }) => {
	const [checkFeature, setCheckFeature] = useState(-1);

    const handleChange = () => {

    }

    // const checkRole = () => {
	// 	let feature = userLogin.features.findIndex((item) => {
	// 		return item === '5f1015df39a6feaad03f4982';
    //     });
	// 	return feature;
    // }

    // useEffect(() => {
    //     checkRole();
    // },[checkFeature]);

    return (
        <div className="header wow fadeInDown">
            <nav className="nav">
                <ul className="logo">
                    <li>
                        <Link to="/">
                            <img src={Logo} alt="Logo"></img>
                        </Link>
                    </li>
                </ul>
                <ul className="nav__list">
                    <li>
                        <Link to="/">Trang chủ</Link>
                    </li>
                    <li>
                        <Link to="/courses">Danh sách khóa học</Link>
                    </li>
                    <li>
                        <div className="cart">
                            <span>1</span>
                            <i className="fa fa-shopping-cart"></i>
                            <div className="nav__cart">
                                <ul className="list">
                                    <li>
                                        <Link to="/courses/detail">
                                            <img src={Logo} alt=""></img>
                                            <div className="item__info">
                                                <article>ReactJS</article>
                                                <p>$12.99</p>
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/courses/detail">
                                            <img src={Logo} alt=""></img>
                                            <div className="item__info">
                                                <article>Programing Mobile</article>
                                                <p>$12.99</p>
                                            </div>
                                        </Link>
                                    </li>
                                </ul>
                                <Link to="/cart" className="btn__cart">ĐI ĐẾN GIỎ HÀNG</Link>
                            </div>
                        </div>
                    </li>
                    { userLogin.username ?
                        <>
                            <li>
                                <div className="information">
                                    <span>1</span>
                                    <i className="fa fa-bell"></i>
                                    <div className="information__wrapper">
                                        <ul className="list">
                                            <li>
                                                <Link to="/courses/detail">
                                                    <img src={Logo} alt=""></img>
                                                    <div className="item__info">
                                                        <article>Trương Minh Tiến</article>
                                                        <p>Gửi cho bạn lời mời kết bạn.</p>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/courses/detail">
                                                    <img src={Logo} alt=""></img>
                                                    <div className="item__info">
                                                        <article>Programing Mobile</article>
                                                        <p>$12.99</p>
                                                    </div>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                            <li> 
                            <div className="user">
                                <div className="content">
                                    <i className="fa fa-user-circle avatar"></i>
                                    <span>{userLogin.name}</span>
                                    <i className="fa fa-angle-down"></i>
                                </div>
                                <div className="user__feature">
                                    <Link to={`/profile/${userLogin.id}`} onClick={() => {
                                        findUser(`${userLogin.id}`);
                                    }}>Thông tin cá nhân</Link>
                                    {   checkRole ? 
                                            <Link to="/admin">Quản lý hệ thống</Link>
                                        :
                                            <></>
                                    }
                                    <Link to="/logout" onClick={() => {
                                        localStorage.removeItem('token');
                                        logOut();
                                    }}>Đăng xuất</Link>
                                </div>
                            </div>
                        </li>
                        </>
                            :
                        <>
                            <li>
                                <Link to="/signup">Đăng ký</Link>
                            </li>
                            <li>
                                <Link to="/signin">Đăng nhập</Link>
                            </li>
                        </>
                    }
                </ul> 
            </nav>
            <nav className="nav__courses">
                <ul>
                    <li>
                        <Select size="large" onChange={handleChange} placeholder="Lập trình Front-End">
                            <Option value="lucy">HTML, CSS cơ bản</Option>
                            <Option value="disabled">Javascript cơ bản</Option>
                            <Option value="Yiminghe">Javascript nâng cao</Option>
                        </Select>
                    </li>
                    <li>
                        <Select size="large" onChange={handleChange} placeholder="Lập trình Back-End">
                            <Option value="lucy">HTML, CSS cơ bản</Option>
                            <Option value="disabled">Javascript cơ bản</Option>
                            <Option value="Yiminghe">Javascript nâng cao</Option>
                        </Select>
                    </li>
                    <li>
                        <Select size="large" onChange={handleChange} placeholder="Lập trình Nhúng">
                            <Option value="lucy">HTML, CSS cơ bản</Option>
                            <Option value="disabled">Javascript cơ bản</Option>
                            <Option value="Yiminghe">Javascript nâng cao</Option>
                        </Select>
                    </li>
                    <li>
                        <Select size="large" onChange={handleChange} placeholder="Lập trình Tư duy">
                            <Option value="lucy">HTML, CSS cơ bản</Option>
                            <Option value="disabled">Javascript cơ bản</Option>
                            <Option value="Yiminghe">Javascript nâng cao</Option>
                        </Select>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        userLogin: state.userLogin,
        checkRole: state.checkRole
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        logOut: () => {
            dispatch(action.logOutUser());
        },
        findUser: (id) => {
            dispatch(action.findUserById(id));
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(HeaderComponent);