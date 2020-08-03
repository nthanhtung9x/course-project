import { combineReducers } from 'redux';
import userLogin from './userLoginStore';
import profile from './profileStore';
import checkRole from './checkRoleStore';
import courses from './courseStore';
import detailCourse from './detailCourseStore';
import users from './usersStore';
import registerCourse from './registerCourseStore';
import coursesOfUser from './coursesOfUserStore';
import rolesStore from './rolesStore';
import featuresStore from './featuresStore';
import postStore from './postStore';
import likeStore from './likeList';
import commentStore from './commentStore';

const myReducers = combineReducers({
    userLogin,
    profile,
    checkRole,
    courses,
    detailCourse,
    users,
    registerCourse,
    coursesOfUser,
    rolesStore,
    featuresStore,
    postStore,
    likeStore,
    commentStore
})

export default myReducers;