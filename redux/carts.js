import * as ActionTypes from './ActionTypes';

export const carts = (state = [], action) => {
    switch (action.type) {
        case ActionTypes.ADD_CART:
            if (state.includes(action.payload)) {
                return state;
            }
            return state.concat(action.payload);

        case ActionTypes.DELETE_CART:
            return state.filter(cart => cart !== action.payload);

        default:
            return state;
    }
};