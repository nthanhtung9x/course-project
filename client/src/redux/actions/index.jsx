import * as types from './actionType';
import axios from 'axios';
import {API} from '../../API/api';

// Users 
export const checkUser = (token) => {
    return (dispatch) => {
        return axios({
            method:'GET',
            url:`${API}/checkUser`,
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
            url:`${API}/profile/${id}`,
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
            url:`${API}/users`,
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
            url:`${API}/updateUser`,
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
            url:`${API}/deleteUser`,
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
            url:`${API}/createUser`,
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
            url:`${API}/courses`
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
            url:`${API}/course/detail/${id}`,
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
            url:`${API}/registerCourses`,
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
export const setDefaultRegisterCourse = () => {
    return {
        type:types.DEFAULT_REGISTER_COURSE
    }
}

export const createCourseAPI = (token,data) => {
    return (dispatch) => {
        return axios({
            url:`${API}/createCourse`,
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
            url:`${API}/updateCourse`,
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
            url:`${API}/deleteCourse`,
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
            url:`${API}/getCoursesOfUser`,
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

export const getRolesAPI = (token) => {
    return (dispatch) => {
        return axios({
            url:`${API}/getRoles`,
            method:'GET',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            } 
        }).then(res => {
            dispatch(getRoles(res.data));
        }).catch(err => console.log(err));
    }
}
export const getRoles = (roles) => {
    return {
        type: types.GET_ROLE,
        roles
    }
}


export const getFeaturessAPI = (token) => {
    return (dispatch) => {
        return axios({
            url:`${API}/getFeatures`,
            method:'GET',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            } 
        }).then(res => {
            dispatch(getFeatures(res.data));
        }).catch(err => console.log(err));
    }
}
export const getFeatures = (features) => {
    return {
        type: types.GET_FEATURES,
        features
    }
}

export const addRoleAPI = (token,data) => {
    return (dispatch) => {
        return axios({
            url:`${API}/addRole`,
            method:'POST',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data
        }).then(res => {
            dispatch(loadingRoleAfterAddRole(res.data));
        }).catch(err => console.log(err))
    }
}
export const loadingRoleAfterAddRole = (roles) => {
    return {
        type: types.ADD_ROLE,
        roles
    }
} 


export const UpdateRoleAPI = (token,data) => {
    return (dispatch) => {
        return axios({
            url:`${API}/updateRole`,
            method:'PUT',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data
        }).then(res => {
            dispatch(loadingRoleAfterUpdateRole(res.data));
        }).catch(err => console.log(err))
    }
}
export const loadingRoleAfterUpdateRole = (roles) => {
    return {
        type: types.UPDATE_ROLE,
        roles
    }
} 

export const DeleteRoleAPI = (token,data) => {
    return (dispatch) => {
        return axios({
            url:`${API}/deleteRole`,
            method:'DELETE',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data
        }).then(res => {
            dispatch(loadingRoleAfterDeleteRole(res.data));
        }).catch(err => console.log(err))
    }
}
export const loadingRoleAfterDeleteRole = (roles) => {
    return {
        type: types.DELETE_ROLE,
        roles
    }
} 

export const getPostAPI = (token, id) => {
    return (dispatch) => {
        return axios({
            method:'GET',
            url:`${API}/getPostById/${id}`,
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            }
        }).then(res => {
            dispatch(getPost(res.data.postList));
            dispatch(getLikePost(res.data.likePost));
        }).catch(err => console.log(err))
    }
}
export const getPost = (postList) => {
    return {
        type: types.GET_POST_ID,
        postList
    }
}

export const createPostAPI = (token, data) => {
    return (dispatch) => {
        axios({
            method:'POST',
            url:`${API}/createPost`,
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data
        }).then(res => {
            dispatch(createPost(res.data));
        }).catch(err => console.log(err))
    }
}
export const createPost = (postList) => {
    return {
        type: types.CREATE_POST,
        postList
    }
}

export const deletePostAPI = (token, id) => {
    return (dispatch) => {
        axios({
            method:'DELETE',
            url:`${API}/deletePost/${id}`,
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
        }
        }).then(res => {
            dispatch(deletePost(res.data));
        }).catch(err => console.log(err));
    }
}
export const deletePost = (postList) => {
    return {
        type: types.DELETE_POST,
        postList
    }
}

export const updatePostAPI = (token, data) => {
    return (dispatch) => {
        return axios({
            method:'PUT',
            url:`${API}/updatePost`,
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data
        }).then(res => {
            dispatch(updatePost(res.data));
        }).catch(err => console.log(err));
    }
}
export const updatePost = (postList) => {
    return {
        type: types.DELETE_POST,
        postList
    }
}

export const getLikePost = (likeList) => {
    return {
        type: types.GET_LIKE_POST,
        likeList
    }
}

export const handleLikePostAPI = (token, idPost, idUser) => {
    return (dispatch) => {
        return axios({
            method:'POST',
            url:`${API}/likePost`,
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data: {
                idPost,
                idUser
            }
        }).then(res => {
            dispatch(updateLikePost(res.data.postList));
            dispatch(updateLikeList(res.data.likePost));
        }).catch(err => console.log(err));
    }
};
export const updateLikePost = (postList) => {
    return {
        type: types.UPDATE_POST_AFTER_LIKE,
        postList
    }
}
export const updateLikeList = (likeList) => {
    return {
        type: types.UPDATE_LIKE_LIST,
        likeList
    }
}


export const getCommentByIdPostAPI = (idPost) => {
    return (dispatch) => {
        return axios({
            method:'GET',
            url:`${API}/getCommentPost/${idPost}`,
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => {
            dispatch(getCommentByIdPost(res.data));
        }).catch(err => console.log(err));
    }
}
export const getCommentByIdPost = (commentList) => {
    return {
        type: types.GET_COMMENT_BY_ID_POST,
        commentList
    }
}

export const createCommentByIdPostAPI = (token, data) => {
    return (dispatch) => {
        return axios({
            method:'POST',
            url:`${API}/createCommentPost`,
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data
        }).then(res => {
            dispatch(createCommentByIdPost(res.data));
        }).catch(err => console.log(err));
    }
}
export const createCommentByIdPost = (commentList) => {
    return {
        type: types.CREATE_COMMENT_BY_ID_POST,
        commentList
    }
}


export const deleteCommentByIdPostAPI = (token, id) => {
    return (dispatch) => {
        return axios({
            method:'DELETE',
            url:`${API}/deleteCommentPost/${id}`,
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
        }).then(res => {
            dispatch(deleteCommentByIdPost(res.data));
        }).catch(err => console.log(err));
    }
}
export const deleteCommentByIdPost = (commentList) => {
    return {
        type: types.DELETE_COMMENT_BY_ID_POST,
        commentList
    }
}


export const updateCommentByIdPostAPI = (token, data) => {
    return (dispatch) => {
        return axios({
            method:'PUT',
            url:`${API}/updateCommentPost`,
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data
        }).then(res => {
            dispatch(updateCommentByIdPost(res.data));
        }).catch(err => console.log(err));
    }
}
export const updateCommentByIdPost = (commentList) => {
    return {
        type: types.UPDATE_COMMENT_BY_ID_POST,
        commentList
    }
}