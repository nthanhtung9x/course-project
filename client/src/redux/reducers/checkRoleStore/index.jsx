import * as types from '../../actions/actionType';

let initialState = false;

const checkRole = (state = initialState, action) => {
    switch(action.type) {
        case types.CHECK_ROLE: {
            let temp = action.user.features.findIndex(item => 
                item === "5f1015df39a6feaad03f4982"	
            );
            console.log(temp);
            if(temp >= 0) {
                state = true;
                return state;
            }
            return state;
        }
        case types.LOGOUT_USER: {
            state = false;
            return state;
        }
        default:
            return state;
    }
}

export default checkRole;