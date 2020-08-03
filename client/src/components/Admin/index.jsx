import React, { useState, useEffect } from 'react';

import Logo from "../../images/logo.jpg";
import AdminCommon from './Common';
import ManagerCourses from './ManagerCourses';
import ManagerUsers from './ManagerUsers';

import * as action from '../../redux/actions';
import { connect } from 'react-redux';

import { Layout, Menu, Avatar } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  ApartmentOutlined
} from '@ant-design/icons';
import { 
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory, 
    useLocation
} from 'react-router-dom';
import ManagerRoles from './ManagerRoles';

const { Sider } = Layout;

const AdminComponent = ({ userLogin, getUsers, getCourses, users, courses, checkRole }) => {

    const [collapsed,setCollapsed] = useState(false);
    const history = useHistory();

    const onCollapse = collapsed => {
        setCollapsed(collapsed);
    };

    const handleBackHome = () => {
        history.push("/");
    };

    useEffect(() => {
        if(localStorage.getItem('token')) {
            getUsers(JSON.parse(localStorage.getItem('token')).token);
            getCourses(JSON.parse(localStorage.getItem('token')).token);
        }
    },[]);

    let location = useLocation();
    const { pathname } = location;
    
    return (
        <Router> 
            <Layout style={{ minHeight: '100vh' }} className="admin">
                <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                        <div className="logo">
                            <Link to="/" onClick={handleBackHome}>
                                <img src={Logo} alt="logo"/>
                            </Link>
                        </div>

                        <Menu theme="dark" defaultSelectedKeys={[pathname]} mode="inline">
                            <Menu.Item key="/admin" icon={<PieChartOutlined />}>
                                <Link to="/admin">
                                    Thông tin chung
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/admin/courses" icon={<DesktopOutlined />}>
                                <Link to="/admin/courses">
                                    Quản lý khóa học
                                </Link>
                                
                            </Menu.Item>
                            <Menu.Item key="/admin/users" icon={<TeamOutlined />}>
                                <Link to="/admin/users">
                                    Quản lý người dùng
                                </Link>
                            </Menu.Item>
                            { checkRole.checkManagerRole ? 
                                    <Menu.Item key="/admin/roles" icon={<ApartmentOutlined />}>
                                        <Link to="/admin/roles">
                                            Quản lý chức vụ
                                        </Link>
                                    </Menu.Item>
                                :
                                    <></>
                            }
                        </Menu>
                    </Sider>

                <Layout className="site-layout">
                        <div className="site__wrapper">
                            <div className="site__user">
                                <Avatar>T</Avatar>
                                <span>{userLogin.name}</span>
                            </div>
                            <Switch>
                                <Route path="/admin/courses">
                                    <ManagerCourses/>
                                </Route>
                                <Route path="/admin/users">
                                    <ManagerUsers/>
                                </Route>
                                <Route path="/admin/roles">
                                    <ManagerRoles/>
                                </Route>
                                <Route exact path="/admin">
                                    <AdminCommon/>
                                </Route>
                            </Switch>
                        </div>
                    </Layout>
                </Layout>    
        </Router>  
    )
}

const mapStateToProps = state => {
    return {
        userLogin: state.userLogin,
        users: state.users,
        courses: state.courses,
        checkRole: state.checkRole
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getUsers: (token) => {
            dispatch(action.getUsersAPI(token));
        },
        getCourses: (token) => {
            dispatch(action.getCoursesAPI(token));
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AdminComponent);
