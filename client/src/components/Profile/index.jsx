import React, { useState, useEffect } from 'react';

import WallComponent from './Wall';
import ProfileCourses from './Courses';
import ProfileFriendsList from './Friends';
import ProfileDetail from './Detail';

import { connect } from 'react-redux';
import * as action from '../../redux/actions';

import { Menu } from 'antd';
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
    const [current, setCurrent] = useState('wall');

    const handleClick = e => {
        setCurrent(e.key);
    };

    useEffect(() => {
        findUser(match.params.id);
    },[]);

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
                            <Menu mode="horizontal" onClick={handleClick} selectedKeys={[current]}>
                                <Menu.Item key="wall" icon={<FormOutlined />}>
                                    <Link to="/profile/wall">
                                        Trang cá nhân
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="friends" icon={<UsergroupAddOutlined />}>
                                    <Link to="/profile/friends">
                                        Danh sách bạn bè
                                    </Link>
                                </Menu.Item>

                                <Menu.Item key="courses" icon={<AppstoreOutlined />}>
                                    <Link to="/profile/coursesList">
                                        Danh sách khóa học
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="detail" icon={<SettingOutlined />}>
                                    <Link to="/profile/detail">
                                        Thông tin tài khoản
                                    </Link>
                                </Menu.Item>
                                   
                            </Menu>
                        </div>
                        <Switch>
                            <Route path="/profile/wall">
                                <WallComponent/>
                            </Route>
                            <Route path="/profile/coursesList">
                                <ProfileCourses/>
                            </Route>
                            <Route path="/profile/friends">
                                <ProfileFriendsList/>
                            </Route>
                            <Route path="/profile/detail">
                                <ProfileDetail/>
                            </Route>
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
                        </div>
                        <div className="profile__main">
                        <div className="profile__main__control">
                            <Menu mode="horizontal" onClick={handleClick} selectedKeys={[current]}>
                                <Menu.Item key="wall" icon={<FormOutlined />}>
                                    <Link to="/profile/wall">
                                        Trang cá nhân
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="friends" icon={<UsergroupAddOutlined />}>
                                    <Link to="/profile/friends">
                                        Danh sách bạn bè
                                    </Link>
                                </Menu.Item>
                            </Menu>
                        </div>
                        <Switch>
                            <Route path="/profile/wall">
                                <WallComponent/>
                            </Route>
                            
                            <Route path="/profile/friends">
                                <ProfileFriendsList/>
                            </Route>
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