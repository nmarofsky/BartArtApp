import * as ActionTypes from './ActionTypes';

export const paintings = (state = { isLoading: true,
                                     errMess: null,
                                     paintings: []}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_PAINTINGS:
            return {...state, isLoading: false, errMess: null, paintings: action.payload};

        case ActionTypes.PAINTINGS_LOADING:
            return {...state, isLoading: true, errMess: null, paintings: []}

        case ActionTypes.PAINTINGS_FAILED:
            return {...state, isLoading: false, errMess: action.payload};

        default:
          return state;
      }
};