import * as types from '../../actions/actionType';

const initialState = null;

const registerCourse = (state = initialState, action) => {
    switch(action.type) {
        case types.REGISTER_COURSE: {
            let result = false;
            if(action.message === 'success') {
                result = true;
            } 
            state = result;
            return state;
        }
        default: {
            return state;
        }
    }
}

export default registerCourse;