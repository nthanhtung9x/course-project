import * as types from '../../actions/actionType';

const initialState = [];

const featuresStore = (state = initialState, action) => {
    switch(action.type) {
        case types.GET_FEATURES: {
            let temp = [...action.features];
            state = temp;
            return [...state];
        }
        default: {
            return [...state];
        }
    }
};

export default featuresStore;