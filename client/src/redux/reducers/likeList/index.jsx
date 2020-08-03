import * as type from '../../actions/actionType';

const inititalState = [];

const likeStore = (state = inititalState, action) => {
    switch(action.type) {
        case type.GET_LIKE_POST: {
            let temp = [...state];
            temp = action.likeList;
            state = temp;
            return [...state];
        }
        case type.UPDATE_LIKE_LIST: {
            let temp = [...state];
            temp = action.likeList;
            state = temp;
            return [...state];
        }
        default:
            return [...state];
    }
}

export default likeStore;