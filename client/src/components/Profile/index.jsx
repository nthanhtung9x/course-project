import React, { useState, useEffect } from 'react';

import WallComponent from './Wall';
import ProfileCourses from './Courses';
import ProfileFriendsList from './Friends';
import ProfileDetail from './Detail';

import { connect } from 'react-redux';
import * as action from '../../redux/actions';
import axios from 'axios';
import { API } from '../../API/api';

import { Menu, Button, message, Popover, Input } from 'antd';
import { FormOutlined, AppstoreOutlined, SettingOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import {
    BrowserRouter as Router,
    Switch,
    Route, 
    Link,
    Redirect, 
} from 'react-router-dom';
import VideoCourse from './VideoCourse';

const ProfileComponent = ({ userLogin, findUser, match, profileUser }) => {
    const [current, setCurrent] = useState("");

    const handleClick = e => {
        setCurrent(e.key);
    };

    useEffect(() => {
        findUser(match.params.id);
        handleScrollTop();
    },[]);

    const handleScrollTop = () => {
        window.scrollTo(0,0);
    }


    const handleAddToPendingFriendsAPI = (token, idUserAdd, nameUserAdd, idUserAdded) => {
        axios({
            method:'POST',
            url:`${API}/addPendingFriend`,
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data: {
                idUserAdd,
                nameUserAdd,
                idUserAdded
            }
        }).then(res => {
            if(res.data.message === 'Chờ duyệt') {
                message.warning('Đang chờ duyệt');
            } else if(res.data.message === 'Đã là bạn bè') {
                message.error('Đã là bạn bè');
            } else {
                message.success('Gửi lời mời kết bạn thành công');
            }
        }).catch(err => console.log(err)); 
    }

    const contentMessage = (idSend, idReceive) => (
        <div>
            <Input 
                placeholder="Nhập lời nhắn" 
                name="content"
                value={contentMess}
                onChange={(e)=> {
                    setContentMess(e.target.value)
                }}
            ></Input>
            <Button size="large" className="ant-btn ant-btn-primary" onClick={async() => {
                handleSendMessage(JSON.parse(localStorage.getItem('token')).token, idSend, idReceive, contentMess)
                await hide();
                await setContentMess("");
            }}>Gửi</Button>
        </div>
    );

    const [visible, setVisible] = useState(false);
    const handleVisibleChange = (visible) => {
        setVisible(visible);
    }
    const hide = () => {
        setVisible(false);
    }

    const [contentMess, setContentMess] = useState("");
    const handleSendMessage = (token, idSend, idReceive, content) => {
        return axios({
            method:'POST',
            url:`${API}/sendMessage`,
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data: {
                idSend,
                idReceive,
                content
            }
        }).then(res => {
            if(res.data.message) {
                message.success('Gửi tin nhắn thành công');
            } else {
                message.error('Vui lòng gửi tin nhắn có nội dung');
            }
        }).catch(err => console.log(err));
    }

    return (
	    <Router>
            {
                profileUser.id === userLogin.id && profileUser.id === match.params.id ? 
                    <div className="profile">
                        <div className="profile__top">
                            <div className="profile__avatar">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png" alt=""></img>
                            </div>
                            <p className="profile__name">{profileUser.name}</p>
                        </div>
                        <div className="profile__main">
                        <div className="profile__main__control">
                            <Menu mode="horizontal" onClick={handleClick} selectedKeys={[current ? current : match.url]}>
                                <Menu.Item key={`/profile/wall/${match.params.id}`} icon={<FormOutlined />}>
                                    <Link to={`/profile/wall/${profileUser.id}`}>
                                        Trang cá nhân
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key={`/profile/friends/${match.params.id}`} icon={<UsergroupAddOutlined />}>
                                    <Link to={`/profile/friends/${match.params.id}`}>
                                        Danh sách bạn bè
                                    </Link>
                                </Menu.Item>

                                <Menu.Item key={`/profile/coursesList/${match.params.id}`} icon={<AppstoreOutlined />}>
                                    <Link to={`/profile/coursesList/${profileUser.id}`}>
                                        Danh sách khóa học
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key={`/profile/detail/${match.params.id}`} icon={<SettingOutlined />}>
                                    <Link to={`/profile/detail/${match.params.id}`}>
                                        Thông tin tài khoản
                                    </Link>
                                </Menu.Item>
                                   
                            </Menu>
                        </div>
                        <Switch>
                            <Route path="/profile/wall/:id" render={({match}) => {
                                return <WallComponent match={match}/>
                            }}/>
                            <Route path="/profile/coursesList/:id" render={({match}) => {
                                return <ProfileCourses match={match}/>
                            }}>  
                            </Route>
                            <Route path="/profile/friends/:id" render={({match}) => {
                                return <ProfileFriendsList match={match}/>
                            }}/>
                            <Route path="/profile/detail/:id" render={({match}) => {
                                return <ProfileDetail match={match}/>
                            }}/>
                                
                            <Route exact path="/profile/course/:id" render={({match}) => {
                                return <VideoCourse match={match}/>
                                }}
                            />
                        </Switch>
                    </div>
                    </div>
                :
                    profileUser.id !== userLogin.id && profileUser.id === match.params.id ?
                        <div className="profile">
                        <div className="profile__top">
                            <div className="profile__avatar">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png" alt=""></img>
                            </div>
                            <p className="profile__name">{profileUser.name}</p>
                            <div className="profile__control">
                                <Button size="large" className="ant-btn-primary" onClick={() => {
                                    handleAddToPendingFriendsAPI(JSON.parse(localStorage.getItem('token')).token, userLogin.id, userLogin.name, profileUser.id)
                                }}>Thêm bạn bè</Button>
                                <Popover 
                                    content={contentMessage(userLogin.id, profileUser.id)} 
                                    title="Tin nhắn" 
                                    trigger="click"
                                    visible={visible}
                                    onVisibleChange={handleVisibleChange}
                                >
                                    <Button size="large" className="ant-btn-danger">Nhắn tin</Button>
                                </Popover>
                            </div>
                        </div>
                        <div className="profile__main">
                        <div className="profile__main__control">
                            <Menu mode="horizontal" onClick={handleClick} selectedKeys={[current ? current : match.url]}>
                                <Menu.Item key={`/profile/wall/${profileUser.id}`} icon={<FormOutlined />}>
                                    <Link to={`/profile/wall/${profileUser.id}`}>
                                        Trang cá nhân
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key={`/profile/friends/${match.params.id}`} icon={<UsergroupAddOutlined />}>
                                    <Link to={`/profile/friends/${match.params.id}`}>
                                        Danh sách bạn bè
                                    </Link>
                                </Menu.Item>
                            </Menu>
                        </div>
                        <Switch>
                            <Route path="/profile/wall/:id" render={({match}) => {
                                return <WallComponent match={match}/>
                            }}/>
                            
                            <Route path="/profile/friends/:id" render={({match}) => {
                                return <ProfileFriendsList match={match}/>
                            }}/>
                        </Switch>
                    </div>
                    </div>
                    : 
                        <h1 style={{marginTop:'120px'}}>Không tìm thấy</h1>
            }
        </Router>

    )
}

const mapStateToProps = state => {
    return {
        profileUser: state.profile,
        userLogin: state.userLogin
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        findUser: (id) => {
            dispatch(action.findUserById(id));
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProfileComponent);