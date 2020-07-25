import * as types from '../../actions/actionType';
const initialState = {};

const detailCourse = (state = initialState, action) => {
    switch(action.type) {
        case types.FIND_COURSE: {
            let temp = {...action.course};
            state = {...temp};
            return {...state};
        }
        default: {
            return {...state};
        }
    }
}

export default detailCourse;