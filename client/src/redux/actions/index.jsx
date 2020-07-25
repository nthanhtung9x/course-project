import * as types from './actionType';
import axios from 'axios';


// Users 
export const checkUser = (token) => {
    return (dispatch) => {
        return axios({
            method:'GET',
            url:'https://courses-project-api.herokuapp.com/checkUser',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            }
        }).then(res => {
            dispatch(saveUser(res.data)); 
            dispatch(checkRole(res.data)); 
        }).catch(err => console.log(err))
    }
};

export const saveUser = (user) => {
    return {
        type: types.SAVE_USER,
        user
    }
};

export const checkRole = (user) => {
    return {
        type: types.CHECK_ROLE,
        user
    }
};

export const logOutUser = () => {
    return {
        type: types.LOGOUT_USER
    }
}

export const findUserById = (id) => {
    return (dispatch) => {
        return axios({
            method:'GET',
            url:`https://courses-project-api.herokuapp.com/profile/${id}`,
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => {
            dispatch(findUser(res.data));
        }).catch(err => console.log(err))
    }
}

export const findUser = (user) => {
    return {
        type: types.FIND_USER,
        user
    }
}

export const getUsersAPI = (token) => {
    return (dispatch) => {
        return axios({
            method:'GET',
            url:'https://courses-project-api.herokuapp.com/users',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            }
        }).then(res => {
            dispatch(getUsers(res.data));
        }).catch(err => console.log(err));
    }
}

export const getUsers = (users) => {
    return {
        type: types.GET_USERS,
        users
    }
}

export const updateUserAPI = (token, data) => {
    return (dispatch) => {
        return axios({
            method:'PUT',
            url:'https://courses-project-api.herokuapp.com/updateUser',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data
            }).then(res => {
                dispatch(updateUser(res.data));
            }).catch(err => console.log(err))
    }
}
export const updateUser = (users) => {
    return {
        type: types.UPDATE_USER,
        users
    }
}

export const deleteUserAPI = (token, data) => {
    return (dispatch) => {
        return axios({
            method:'DELETE',
            url:'https://courses-project-api.herokuapp.com/deleteUser',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data
            }).then(res => {
                dispatch(deleteUser(res.data));
            }).catch(err => console.log(err))
    }
}
export const deleteUser = (users) => {
    return {
        type: types.DELETE_USER,
        users
    }
}

export const createUserAPI = (token, data) => {
    return (dispatch) => {
        return axios({
            method:"POST",
            url:'https://courses-project-api.herokuapp.com/createUser',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data
        }).then(res => {
            if(res.data.userList.length > 0) {
                dispatch(getUsers(res.data.userList));
            }
        }).catch(err => console.log(err));
    }
};


// Courses
export const getCoursesAPI = () => {
    return (dispatch) => {
        return axios({
            method:'GET',
            url:'https://courses-project-api.herokuapp.com/courses'
        }). then(res => {
            dispatch(getCourses(res.data));
        }).catch(err => console.log(err));
    }
}
export const getCourses = (courses) => {
    return {
        type: types.GET_COURSES,
        courses
    }
};

export const findCourseById = (id) => {
    return (dispatch) => {
        return axios({
            method:'GET',
            url:`https://courses-project-api.herokuapp.com/course/detail/${id}`,
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => {
            dispatch(getDetailCourse(res.data));
        }).catch(err => console.log(err))
    }
}

export const getDetailCourse = (course) => {
    return {
        type: types.FIND_COURSE,
        course
    }
};

export const registerCourseAPI = (token,data) => {
    return (dispatch) => {
        return axios({
            method:'POST',
            url:'https://courses-project-api.herokuapp.com/registerCourses',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data
        }).then(res => {
            dispatch(loadingUsersAfterRegisterCourse(res.data.message))
        }).catch(err => console.log(err));
    }
}
export const loadingUsersAfterRegisterCourse = (message) => {
    return {
        type: types.REGISTER_COURSE,
        message
    }
}

export const createCourseAPI = (token,data) => {
    return (dispatch) => {
        return axios({
            url:'https://courses-project-api.herokuapp.com/createCourse',
            method:'POST',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data
        }).then(res => {
            dispatch(loadingCourseAfterCreate(res.data));
        }).catch(err => console.log(err));
    }
}
export const loadingCourseAfterCreate = (courses) => {
    return {
        type: types.ADD_COURSE,
        courses
    }
}

export const updateCourseAPI = (token, data) => {
    return (dispatch) => {
        return axios({
            method:"PUT",
            url:'https://courses-project-api.herokuapp.com/updateCourse',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data
        }).then(res => {
            dispatch(loadingCourseAfterUpdate(res.data));
        }).catch(err => console.log(err))
    }
}
export const loadingCourseAfterUpdate = (courses) => {
    return {
        type: types.UPDATE_COURSE,
        courses
    }
}

export const deleteCourseAPI = (token, id) => {
    return (dispatch) => {
        return axios({
            method:"DELETE",
            url:'https://courses-project-api.herokuapp.com/deleteCourse',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data: { id }
        }).then(res => {
            dispatch(loadingCourseAfterDelete(res.data));
        }).catch(err => console.log(err))
    }
}
export const loadingCourseAfterDelete = (courses) => {
    return {
        type: types.DELETE_COURSE,
        courses
    }
}

export const getCoursesOfUserAPI = (token) => {
    return (dispatch) => {
        return axios({
            url:'https://courses-project-api.herokuapp.com/getCoursesOfUser',
            method:'GET',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            } 
        }).then(res => {
            dispatch(getCoursesOfUser(res.data));
        }).catch(err => console.log(err));
    }
}
export const getCoursesOfUser = (courses) => {
    return {
        type: types.GET_COURSES_USER,
        courses
    }
}