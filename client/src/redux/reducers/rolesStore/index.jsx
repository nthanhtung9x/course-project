import * as types from '../../actions/actionType';

const initialState = [];

const rolesStore = (state = initialState, action) => {
    switch(action.type) {
        case types.GET_ROLE: {
            let temp = [...action.roles];
            state = temp;
            return [...state];
        }
        case types.ADD_ROLE: {
            if(action.roles.message) {
                return [...state];
            }
            let temp = [...action.roles];
            state = temp;
            return [...state];
        }
        case types.UPDATE_ROLE: {
            if(action.roles.message) {
                return [...state];
            }
            let temp = [...action.roles];
            state = temp;
            return [...state];
        }
        case types.DELETE_ROLE: {
            if(action.roles.message) {
                return [...state];
            }
            let temp = [...action.roles];
            state = temp;
            return [...state];
        }
        default: {
            return [...state];
        }
    }
};

export default rolesStore;