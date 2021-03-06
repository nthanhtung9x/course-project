import * as types from '../../actions/actionType';

let initialState = {
    username: "",
    name:"",
    role: "",
    id: "",
    logout: true
};

const userLogin = (state = initialState, action) => {
    switch(action.type) {
        case types.SAVE_USER: {
            let temp = {
                username: action.user.username,
                name: action.user.name,
                role: action.user.role,
                id: action.user.id,
                logout: false
            };
            state = temp;
            return {...state};
        }
        case types.LOGOUT_USER: {
            let temp = {
                username:"",
                name:"",
                role: "",
                id:"",
                logout: true
            };
            state = temp;
            return {...state};
        }
        default:
            return {...state};
    }
}

export default userLogin;