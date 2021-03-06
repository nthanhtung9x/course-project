import React, { Suspense, useEffect } from 'react';
import './css/main.css';
import 'antd/dist/antd.css';

// import HeaderComponent from './components/Header';
// import CarouselComponent from './components/Carousel';
// import HomeComponent from './components/page/Home';
// import { FooterComponent } from './components/Footer';
// import { RegisterComponent } from './components/Register';
// import LoginComponent from './components/Login';
// import CoursesComponent from './components/Courses';
// import DetailCourse from './components/DetailCourse';
// import ProfileComponent from './components/Profile';
// import AuthenticationPassword from './components/AuthenticationPassword';

import { connect } from 'react-redux';
import * as action from './redux/actions';
import WOW from 'wow.js';
import { BackTop, Spin } from 'antd';
import { ArrowUpOutlined, LoadingOutlined } from '@ant-design/icons';

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
// import AdminComponent from './components/Admin';
// import { HomeTemplates } from './templates/HomeTemplates';

const HeaderComponent = React.lazy(() => import('./components/Header'));
const CarouselComponent = React.lazy(() => import('./components/Carousel'));
const HomeComponent = React.lazy(() => import('./components/page/Home'));
const FooterComponent = React.lazy(() => import('./components/Footer'));
const RegisterComponent = React.lazy(() => import('./components/Register'));
const LoginComponent = React.lazy(() => import('./components/Login'));
const CoursesComponent = React.lazy(() => import('./components/Courses'));
const DetailCourse = React.lazy(() => import('./components/DetailCourse'));
const ProfileComponent = React.lazy(() => import('./components/Profile'));
const AuthenticationPassword = React.lazy(() => import('./components/AuthenticationPassword'));
const AdminComponent = React.lazy(() => import('./components/Admin'));

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const App = ({ userLogin, checkUser, checkRole }) => {
	useEffect(() => {
		if (localStorage.getItem('token')) {
			checkUser(JSON.parse(localStorage.getItem('token')).token);
		}
	}, []);

	useEffect(() => {
		new WOW({
			live: false
		}).init();
	}, []);

	const style = {
		height: 40,
		width: 40,
		lineHeight: '40px',
		borderRadius: 4,
		backgroundColor: '#22075e',
		color: '#fff',
		textAlign: 'center',
		fontSize: 14,
	};

	return (
		<Router>
			<div>
				<Suspense fallback={<Spin
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
				</Spin>}>
					<Switch>
						{/* <HomeTemplates exact path="/authentication-password" Component={AuthenticationPassword} />
				<HomeTemplates exact path="/courses" Component={AuthenticationPassword} /> */}


						<Route path="/admin">
							{checkRole.managerSystem ?
								<AdminComponent />
								:
								<>
									<HeaderComponent />
									<CarouselComponent />
									<CoursesComponent />
									<FooterComponent />
								</>
							}
						</Route>
						<Route path="/signin">
							{!userLogin.username ?
								<>
									<HeaderComponent />
									<LoginComponent />
									<FooterComponent />
								</>
								: <Redirect to="/" />
							}
						</Route>
						<Route path="/signup">
							{!userLogin.username ?
								<>
									<HeaderComponent />
									<RegisterComponent />
									<FooterComponent />
								</>
								: <Redirect to="/" />
							}
						</Route>
						<Route path="/authentication-password">
							<HeaderComponent />
							<AuthenticationPassword />
							<FooterComponent />
						</Route>
						<Route path="/courses">
							<HeaderComponent />
							<CarouselComponent />
							<CoursesComponent />
							<FooterComponent />
						</Route>
						<Route path="/course/detail/:id" render={({ match }) => {
							return <>
								<HeaderComponent />
								<DetailCourse match={match} />
								<FooterComponent />
							</>
						}} />
						<Route path="/profile/friends/:id" render={({ match }) => {
							return <>
								<HeaderComponent />
								<ProfileComponent match={match} />
								<FooterComponent />
							</>
						}}></Route>
						<Route path="/profile/coursesList/:id" render={({ match }) => {
							return <>
								<HeaderComponent />
								<ProfileComponent match={match} />
								<FooterComponent />
							</>
						}}>
						</Route>
						<Route path="/profile/detail/:id" render={({ match }) => {
							return <>
								<HeaderComponent />
								<ProfileComponent match={match} />
								<FooterComponent />
							</>
						}}>
						</Route>
						<Route path="/profile/wall/:id" render={({ match }) => {
							return <>
								<HeaderComponent />
								<ProfileComponent match={match} />
								<FooterComponent />
							</>
						}}
						/>
						<Route path="/logout">
							<Redirect to="/signin" />
						</Route>
						<Route exact path="/">
							<HeaderComponent />
							<CarouselComponent />
							<HomeComponent />
							<FooterComponent />
						</Route>
						<Route>
							<h1>Page Not Found 404</h1>
						</Route>
					</Switch>
				</Suspense>
				<BackTop style={{ right: '34px', top: '588px' }}>
					<div style={style}><ArrowUpOutlined /></div>
				</BackTop>
			</div>
		</Router>
	);
}

const mapStateToProps = state => {
	return {
		userLogin: state.userLogin,
		profileUser: state.profile,
		checkRole: state.checkRole
	}
}

const mapDispatchToProps = (dispatch, props) => {
	return {
		checkUser: (token) => {
			dispatch(action.checkUser(token));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
