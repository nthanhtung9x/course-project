import * as type from '../../actions/actionType';



const inititalState = [];
const postStore = (state = inititalState, action) => {
    switch(action.type) {
        case type.GET_POST_ID: {
            let temp = [...state];
            temp = action.postList;
            state = temp;
            return [...state];
        }
        case type.CREATE_POST: {
            let temp = [...state];
            temp = action.postList;
            state = temp;
            return [...state];
        }
        case type.DELETE_POST: {
            let temp = [...state];
            temp = action.postList;
            state = temp;
            return [...state];
        }
        case type.UPDATE_POST: {
            let temp = [...state];
            temp = action.postList;
            state = temp;
            return [...state];
        }
        case type.UPDATE_POST_AFTER_LIKE: {
            let temp = [...state];
            temp = action.postList;
            state = temp;
            return [...state];
        }
        default:
            return [...state];
    }
}

export default postStore;