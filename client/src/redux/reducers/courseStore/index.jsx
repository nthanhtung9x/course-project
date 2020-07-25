import * as types from '../../actions/actionType';
const initialState = [];

const courses = (state = initialState, action) => {
    switch(action.type) {
        case types.GET_COURSES: {
            let temp = [...action.courses];
            state = [...temp];
            return [...state];
        }
        case types.ADD_COURSE: {
            if(action.courses.message === 'failed') {
                return [...state];
            }
            let temp = [...action.courses.listCourse];
            state = temp;            
            return [...state];
        }
        case types.UPDATE_COURSE: {
            if(action.courses.message === 'failed') {
                return [...state];
            }
            let temp = [...action.courses.listCourse];
            state = temp;            
            return [...state];
        }
        case types.DELETE_COURSE: {
            if(action.courses.message === 'failed') {
                return [...state];
            }
            let temp = [...action.courses.listCourse];
            state = temp;            
            return [...state];
        }
        default: {
            return [...state];
        }
    }
}

export default courses;