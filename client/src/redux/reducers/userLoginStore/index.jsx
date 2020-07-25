import * as types from '../../actions/actionType';

let initialState = {
    username: "",
    role: "",
    features: []
};

const userLogin = (state = initialState, action) => {
    switch(action.type) {
        case types.SAVE_USER: {
            let temp = {...action.user};
            state = temp;
            return {...state};
        }
        case types.LOGOUT_USER: {
            let temp = {
                username:"",
                role: "",
                features: []
            };
            state = temp;
            return {...state};
        }
        default:
            return {...state};
    }
}

export default userLogin;