import * as types from '../../actions/actionType';

let initialState = {
    managerSystem: false,
    checkAddCourse: false,
    checkAddRegister: false,
    checkUpdateCourse: false,
    checkCreateUser: false,
    checkUpdateUser: false,
    checkDeleteUser:false,
    checkManagerRole: false
};

const checkRole = (state = initialState, action) => {
    switch(action.type) {
        case types.CHECK_ROLE: {
            if(action.user.checkManagerSystem) {
                state = {...state, managerSystem: true};
            };
            if(action.user.checkAddCourse) {
                state = {...state, checkAddCourse: true};
            };
            if(action.user.checkAddRegister) {
                state = {...state, checkAddRegister: true};
            };
            if(action.user.checkUpdateCourse) {
                state = {...state, checkUpdateCourse: true};
            };
            if(action.user.checkCreateUser) {
                state = {...state, checkCreateUser: true};
            };
            if(action.user.checkUpdateUser) {
                state = {...state, checkUpdateUser: true};
            };
            if(action.user.checkDeleteUser) {
                state = {...state, checkDeleteUser: true};
            };
            if(action.user.checkManagerRole) {
                state = {...state, checkManagerRole: true};
            };

            return {...state};
        }
        case types.LOGOUT_USER: {
            state ={
                ...state, 
                managerSystem: false,
                checkAddCourse: false,
                checkAddRegister: false,
                checkUpdateCourse:false,
                checkCreateUser: false,
                checkUpdateUser: false,
                checkDeleteUser:false,
                checkManagerRole: false
            };
            return {...state};
        }
        default:
            return {...state};
    }
}

export default checkRole;