import * as types from '../../actions/actionType';

let initialState = {};

const profile = (state = initialState, action) => {
    switch(action.type) {
        case types.FIND_USER: {
            let temp = {...action.user};
            state = temp;
            return {...state};
        }
        default:
            return {...state};
    }
}

export default profile;