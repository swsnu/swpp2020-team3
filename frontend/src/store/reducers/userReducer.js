import * as actionTypes from '../actions/actionTypes';

const initialState = {
  currentUser: {},
}

const reducer = (state = initialState, action) => {
   switch (action.type) {
     case actionTypes.SIGN_UP:
       return { ...state, currentUser: action.user };

     default:
       break;
   }
  return state;
};

export default reducer;