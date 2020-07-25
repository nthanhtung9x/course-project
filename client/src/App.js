import React, { useEffect, useState } from 'react';
import './css/main.css';
import 'antd/dist/antd.css';

import HeaderComponent from './components/Header';
import CarouselComponent from './components/Carousel';
import HomeComponent from './components/page/Home';
import { FooterComponent } from './components/Footer';
import { RegisterComponent } from './components/Register';
import LoginComponent from './components/Login';
import CoursesComponent from './components/Courses';
import DetailCourse from './components/DetailCourse';
import ProfileComponent from './components/Profile';

import { connect } from 'react-redux';
import * as action from './redux/actions';
import WOW from 'wow.js';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AdminComponent from './components/Admin';

const App = ({ userLogin, checkUser, checkRole }) => {
	useEffect(() => {
		if(localStorage.getItem('token')) {
			checkUser(JSON.parse(localStorage.getItem('token')).token);
		}
	},[]);

	useEffect(() => {
        new WOW({
            live: false
        }).init();
    },[]);

  return (
	<Router>
		<div>		
			<Switch>
				<Route path="/admin">
					{ checkRole ? 
							<AdminComponent/>
						:
							<>
								<HeaderComponent/>		
								<CarouselComponent/>
								<CoursesComponent/>
								<FooterComponent/>
							</>
					}
				</Route>
				<Route path="/signin">
					{ 	!userLogin.username ? 
							<>
								<HeaderComponent/>		
								<LoginComponent/>
								<FooterComponent/>
							</>
						: <Redirect to ="/"/>
					}
				</Route>
				<Route path="/signup">
					{ 	!userLogin.username ? 
							<>
								<HeaderComponent/>		
								<RegisterComponent/>
								<FooterComponent/>
							</>
						: <Redirect to ="/"/>
					}
				</Route>
				<Route path="/courses">
					<HeaderComponent/>
					<CarouselComponent/>
					<CoursesComponent/>
					<FooterComponent/>
				</Route>
				<Route path="/course/detail/:id" render={({match}) => {
					return <>
						<HeaderComponent/>
						<DetailCourse match={match}/>
						<FooterComponent/>
					</>
				}}/>
				<Route path="/profile/:id" render={({match}) => {
					return <>
						<HeaderComponent/>
						<ProfileComponent match={match}/>
						<FooterComponent/>
					</>
				}}
				/>
				<Route path="/logout">
					<Redirect to="/"/>
				</Route>
				<Route exact path="/">
					<HeaderComponent/>
					<CarouselComponent/>
					<HomeComponent/>
					<FooterComponent/>
				</Route>
				<Router>
					<h1>Page Not Found 404</h1>
				</Router>
			</Switch>
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

const mapDispatchToProps = (dispatch,props) => {
	return {
		checkUser: (token) => {
			dispatch(action.checkUser(token));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
