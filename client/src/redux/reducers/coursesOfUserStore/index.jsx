import * as types from '../../actions/actionType';

const initialState = [];

const coursesOfUser = (state = initialState, action) => {
    switch(action.type) {
        case types.GET_COURSES_USER: {
            console.log(action.courses.coursesList);
            let temp = [...action.courses.coursesList];
            state = temp;
            return [...state];
        }
        default: {
            return [...state];
        }
    }
}

export default coursesOfUser;