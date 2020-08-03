import * as type from '../../../redux/actions/actionType';

const initialState = [];

const commentStore = (state = initialState, action) => {
    switch(action.type) {
        case type.GET_COMMENT_BY_ID_POST: {
            let temp = [...state];
            temp = action.commentList;
            state = temp;
            return [...state];
        }
        case type.CREATE_COMMENT_BY_ID_POST: {
            let temp = [...state];
            temp = action.commentList;
            state = temp;
            return [...state];
        }
        case type.DELETE_COMMENT_BY_ID_POST: {
            let temp = [...state];
            temp = action.commentList;
            state = temp;
            return [...state];
        }
        case type.UPDATE_COMMENT_BY_ID_POST: {
            let temp = [...state];
            temp = action.commentList;
            state = temp;
            return [...state];
        }
        default: {
            return [...state];
        }
    }
};

export default commentStore;