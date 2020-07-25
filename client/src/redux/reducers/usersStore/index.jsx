import * as types from '../../actions/actionType';

const initialState = [];

const usersStore = (state = initialState, action) => {
    switch(action.type) {
        case types.GET_USERS: {
            let temp = [...action.users];
            let result = [];
            for(let i = 0; i < temp.length; i++) {
                let item = {
                    username: temp[i].username,
                    idRole: temp[i].idRole,
                    name: temp[i].name,
                    phone: temp[i].phone,
                    address: temp[i].address,
                    password: temp[i].password,
                    id: temp[i]._id
                };
                result.push(item);
            }
            state = [...result];
            return [...state];
        }
        case types.UPDATE_USER: {
            let temp = [...action.users];
            let result = [];
            for(let i = 0; i < temp.length; i++) {
                let item = {
                    username: temp[i].username,
                    idRole: temp[i].idRole,
                    name: temp[i].name,
                    phone: temp[i].phone,
                    address: temp[i].address,
                    password: temp[i].password,
                    id: temp[i]._id
                };
                result.push(item);
            }
            state = [...result];
            return [...state];
        }
        case types.DELETE_USER: {
            let temp = [...action.users];
            let result = [];
            for(let i = 0; i < temp.length; i++) {
                let item = {
                    username: temp[i].username,
                    idRole: temp[i].idRole,
                    name: temp[i].name,
                    phone: temp[i].phone,
                    address: temp[i].address,
                    password: temp[i].password,
                    id: temp[i]._id
                };
                result.push(item);
            }
            state = [...result];
            return [...state];
        }
        default: {
            return [...state];
        }
    }
}

export default usersStore;