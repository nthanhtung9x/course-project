import React, {useEffect, useState, useRef} from 'react';

import { Link, useHistory, Redirect } from "react-router-dom";

import Logo from "../../images/logo.jpg";

import { connect } from 'react-redux';
import * as action from '../../redux/actions';
import { API } from '../../API/api';
import axios from 'axios';

import { Select, Input, message, List, Avatar } from 'antd';
import { DeleteOutlined, MenuOutlined } from '@ant-design/icons'
const { Option } = Select;
const { Search } = Input;

const HeaderComponent = ({ userLogin, logOut, findUser, checkRole, getCourse, courses }) => {
    useEffect(() => {
        getCourse();
        getNoti();
        getNotiFriend();
        getNotiMessage();
    }, []);

    // noti courses
    const [notiList, setNotiList] = useState([]);

    const getNoti = () => {
        if(JSON.parse(localStorage.getItem('token'))) {
            return axios({
                url:`${API}/getNews`,
                method:'GET',
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('token')).token,
                    "Content-Type": "application/json",
                }
            }).then(res => {
                setNotiList(res.data);
            }).catch(err => console.log(err));
        }
        return ;
    };

    const handleDeleteNoti = (id) => {
        return axios({
            url:`${API}/deleteNews`,
            method:'DELETE',
            headers: {
                'Authorization': JSON.parse(localStorage.getItem('token')).token,
                "Content-Type": "application/json",
            },
            data: { id }
        }).then(res => {
            setNotiList(res.data);
        }).catch(err => console.log(err));
    }

    const countNoti = () => {
        return notiList.length + notiFriendList.length + notiMessageList.length;
    }

    const renderNoti = () => {
        return notiList.map((item, index) => {
            return  <li key={index}>
                        <div className="item__wrap">
                            <img src={item.imgURL} alt={item.name}></img>
                            <div className="item__info">
                                <article>{item.title}</article>
                                <div>
                                    <p>{item.name}</p>
                                    <p>{item.time}</p>
                                </div>
                            </div>
                            <button className="ant-btn" shape="circle" onClick={() => {
                                handleDeleteNoti(item._id)
                            }}>
                                <DeleteOutlined />
                            </button>
                        </div>
                    </li>
        })
    }

    // noti friend
    const [notiFriendList, setNotiFriendList] = useState([]);
    const getNotiFriend = () => {
        if(JSON.parse(localStorage.getItem('token'))) {
            return axios({
                url:`${API}/getNewsAddFriend`,
                method:'GET',
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('token')).token,
                    "Content-Type": "application/json",
                }
            }).then(res => {
                setNotiFriendList(res.data);
            }).catch(err => console.log(err));
        }
        return ;
    };

    const handleDeleteNotiFriend = (id) => {
        return axios({
            url:`${API}/deleteNewsAddFriend`,
            method:'DELETE',
            headers: {
                'Authorization': JSON.parse(localStorage.getItem('token')).token,
                "Content-Type": "application/json",
            },
            data: { id }
        }).then(res => {
            setNotiFriendList(res.data);
        }).catch(err => console.log(err));
    }

    const handleAddFriend = (id, idUserAdd, idUserAdded) => {
        return axios({
            url:`${API}/addFriend`,
            method:'PUT',
            headers: {
                'Authorization': JSON.parse(localStorage.getItem('token')).token,
                "Content-Type": "application/json",
            },
            data: { 
                id,
                idUserAdd,
                idUserAdded
            }
        }).then(async(res) => {
            if(res.data.message) {
                await setNotiFriendList(res.data.pendingList);
                await message.success('Thêm bạn bè thành công');
            }
        }).catch(err => console.log(err));
    }

    const renderNotiFriendList = () => {
        return notiFriendList.map((item, index) => {
            return  <li key={index}>
                        <div className="item__wrap">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png" alt={index}></img>
                            <div className="item__info">
                                <article>{item.nameUserAdd}</article>
                                <div>
                                    <p>Đã gửi lời mời kết bạn</p>
                                </div>
                            </div>
                            <div style={{
                                display:'flex',
                                flexDirection:'column'
                            }}>
                                <button className="ant-btn ant-btn-primary" onClick={() => {
                                    handleAddFriend(item._id, item.idUserAdd, item.idUserAdded)
                                }}>Xác nhận</button>
                                <button className="ant-btn" shape="circle" onClick={() => {
                                    handleDeleteNotiFriend(item._id)
                                }}>
                                    <DeleteOutlined />
                                </button>
                            </div>
                        </div>
                    </li>
        })
    }

    // noti messsage
    const [notiMessageList, setNotiMessageList] = useState([]);
    const getNotiMessage = () => {
        if(JSON.parse(localStorage.getItem('token'))) {
            return axios({
                method:'GET',
                url:`${API}/getNewsMessage`,
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('token')).token,
                    "Content-Type": "application/json",
                }
            }).then(res => {
                setNotiMessageList(res.data);
            }).catch(err => console.log(err));
        }
        return;
    };
    const handleDeleteNotiMessage = (id) => {
        return axios({
            url:`${API}/deleteNewsMessage`,
            method:'DELETE',
            headers: {
                'Authorization': JSON.parse(localStorage.getItem('token')).token,
                "Content-Type": "application/json",
            },
            data: { id }
        }).then(res => {
            setNotiMessageList(res.data);
        }).catch(err => console.log(err));
    }
    const renderNotiMessageList = () => {
        return notiMessageList.map((item, index) => {
            return  <li key={index}>
                        <div className="item__wrap">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png" alt={index}></img>
                            <div className="item__info">
                                <article>{item.name}</article>
                                <div>
                                    <p>Tin nhắn: {item.content}</p>
                                </div>
                            </div>
                            <button className="ant-btn" shape="circle" onClick={() => {
                                handleDeleteNotiMessage(item._id)
                            }}>
                                <DeleteOutlined />
                            </button>
                        </div>
                    </li>
        })
    }

    // select
    const renderFE = () => {
        return courses.map((item, index) => {
            if(item.type === "FE") {
                return <Option value={item._id} key={index}>
                           {item.name}
                        </Option>
            }
        })
    };

    const renderBE = () => {
        return courses.map((item, index) => {
            if(item.type === "BE") {
                return <Option value={item._id} key={index}>
                           {item.name}
                        </Option>
            }
        })
    };

    const renderProgram = () => {
        return courses.map((item, index) => {
            if(item.type === "program") {
                return  <Option value={item._id} key={index}>
                           {item.name}
                        </Option>
            }
        })
    };

    const renderThinking = () => {
        return courses.map((item, index) => {
            if(item.type === "thinking") {
                return <Option value={item._id} key={index}>
                           {item.name}
                        </Option>
            }
        })
    };
    
    const history = useHistory();
    const handleChange = (value) => {
        return history.push(`/course/detail/${value}`);
    };


    // search
    const [searchText, setSearchText] = useState("");
    const [listSearch, setListSearch] = useState([]);
    const [visible, setVisible] = useState(false);
    const data = [...listSearch];

    const typingTime = useRef(null);

    const handleSearch = (e) => {
        e.preventDefault();
        const value = e.target.value;
        setSearchText(value);
        if(!value) {
            setVisible(false);
            return;
        }
        if(typingTime.current) {
            clearTimeout(typingTime.current);
        }
        typingTime.current = setTimeout(() => {
            axios({
                url:`${API}/searchUser/${value}`,
                method:'GET',
                headers: {
                    "Content-Type": "application/json",
                }
            }).then(res => {
                setListSearch(res.data);
                setVisible(true);
            }).catch(err => console.log(err));
        }, 1000);
    }

    const [collapse, setCollapse] = useState(false);

    return (
        <div className="header">
            <nav className="nav">
                <ul className="logo">
                    <li>
                        <Link to="/">
                            <img src={Logo} alt="Logo"></img>
                        </Link>
                    </li>
                    <li className="search__header">
                        <Search
                            placeholder="Tìm kiếm tại đây"
                            size="large"
                            onChange={handleSearch}
                            value={searchText}
                            // onBlur={() => setVisible(false)}
                        />
                        { visible ? 
                                <div className="search__header__wrap">
                                    <List
                                        onMouseLeave={() => setVisible(false)}
                                        itemLayout="horizontal"
                                        dataSource={data}
                                        renderItem={item => (
                                            <List.Item>
                                                <Link to={`/profile/wall/${item._id}`} onClick={() => {
                                                    findUser(item._id);
                                                    setVisible(false);
                                                }}>
                                                    <List.Item.Meta
                                                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                                    title={item.name}
                                                    />
                                                </Link>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            :
                                <></>
                        }
                    </li>
                </ul>
                <ul className="nav__list">
                    <li>
                        <Link to="/">Trang chủ</Link>
                    </li>
                    <li>
                        <Link to="/courses">Danh sách khóa học</Link>
                    </li>
                    {/* <li>
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
                    </li> */}
                    { userLogin.username ?
                        <>
                            <li>
                                <div className="information">
                                    <span>{countNoti()}</span>
                                    <i className="fa fa-bell"></i>
                                    { countNoti() > 0 ? 
                                            <div className="information__wrapper">
                                                <ul className="list">
                                                    {
                                                        renderNoti()
                                                    }
                                                    {
                                                        renderNotiFriendList()
                                                    }
                                                    {
                                                        renderNotiMessageList()
                                                    }
                                                </ul>
                                            </div>
                                        :
                                            <></>
                                    }
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
                                    <Link to={`/profile/wall/${userLogin.id}`} onClick={() => {
                                        findUser(`${userLogin.id}`);
                                    }}>Thông tin cá nhân</Link>
                                    <Link to={`/profile/coursesList/${userLogin.id}`}>Khóa học của tôi</Link>
                                    {   checkRole.managerSystem ? 
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
                {/* mobile */}
                <label htmlFor="collapse" className="btn-menu-mobile">
                    <MenuOutlined />
                </label>
                <input type="checkbox" id="collapse" onClick={() => setCollapse(true)} hidden></input> 
                <label className="bg-collapse"  onClick={() => setCollapse(false)} style={collapse ? {transform:'translateX(0%)'} : {transform: 'translateX(100%)'}}></label>
                <div className="mobile__nav" style={collapse ? {transform:'translateX(0%)'} : {transform: 'translateX(100%)'}}>
                    <ul className="mobile__list">
                        <li>
                            <Link to="/" onClick={() => setCollapse(false)}>Trang chủ</Link>
                        </li>
                        <li>
                            <Link to="/courses" onClick={() => setCollapse(false)}>Danh sách khóa học</Link>
                        </li>
                        { userLogin.username ?
                                <>
                                    <li> 
                                        <div className="user">
                                            <div className="content">
                                                <i className="fa fa-user-circle avatar"></i>
                                                <span>{userLogin.name}</span>
                                                <i className="fa fa-angle-down"></i>
                                            </div>
                                            <div className="user__feature">
                                                <Link to={`/profile/wall/${userLogin.id}`} onClick={() => {
                                                    findUser(`${userLogin.id}`);
                                                    setCollapse(false);
                                                }}>Thông tin cá nhân</Link>
                                                 <Link to={`/profile/coursesList/${userLogin.id}`} onClick={() => {
                                                     setCollapse(false);
                                                 }}>Khóa học của tôi</Link>
                                                {   checkRole.managerSystem ? 
                                                        <Link to="/admin" onClick={() => {
                                                            setCollapse(false);
                                                        }}>Quản lý hệ thống</Link>
                                                    :
                                                        <></>
                                                }
                                                <Link to="/logout" onClick={() => {
                                                    localStorage.removeItem('token');
                                                    setCollapse(false);
                                                    logOut();
                                                }}>Đăng xuất</Link>
                                            </div>
                                        </div>
                                    </li>
                                </>
                            :
                                <>
                                    <li>
                                        <Link to="/signup" onClick={() => setCollapse(false)}>Đăng ký</Link>
                                    </li>
                                    <li>
                                        <Link to="/signin" onClick={() => setCollapse(false)}>Đăng nhập</Link>
                                    </li>
                                </>
                        }   
                    </ul>
                </div>
            </nav>
            <nav className="nav__courses">
                <ul>
                    <li>
                        <Select size="large" onChange={handleChange} placeholder="Lập trình Front-End">
                            {renderFE()}
                        </Select>
                    </li>
                    <li>
                        <Select size="large" onChange={handleChange} placeholder="Lập trình Back-End">
                            {renderBE()}
                        </Select>
                    </li>
                    <li>
                        <Select size="large" onChange={handleChange} placeholder="Lập trình Nhúng">
                            {renderProgram()}
                        </Select>
                    </li>
                    <li>
                        <Select size="large" onChange={handleChange} placeholder="Lập trình Tư duy">
                            {renderThinking()}
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
        checkRole: state.checkRole,
        courses: state.courses
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        logOut: () => {
            dispatch(action.logOutUser());
        },
        findUser: (id) => {
            dispatch(action.findUserById(id));
        },
        getCourse: () => {
            dispatch(action.getCoursesAPI());
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(HeaderComponent);