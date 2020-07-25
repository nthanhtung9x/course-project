import { combineReducers } from 'redux';
import userLogin from './userLoginStore';
import profile from './profileStore';
import checkRole from './checkRoleStore';
import courses from './courseStore';
import detailCourse from './detailCourseStore';
import users from './usersStore';
import registerCourse from './registerCourseStore';
import coursesOfUser from './coursesOfUserStore';

const myReducers = combineReducers({
    userLogin,
    profile,
    checkRole,
    courses,
    detailCourse,
    users,
    registerCourse,
    coursesOfUser
})

export default myReducers;