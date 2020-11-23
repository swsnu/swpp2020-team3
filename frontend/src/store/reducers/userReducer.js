import * as actionTypes from '../actions/actionTypes';

const initialState = {
  currentUser: {},
  getuser: null,
  is_authenticated: null,
}

const reducer = (state = initialState, action) => {
  //  switch (action.type) {
  //    case actionTypes.SIGN_UP:
  //      return { ...state, currentUser: action.user };

  //    default:
  //      break;
  //  }
  switch(action.type) {
    case actionTypes.GET_USER:
      return {...state, getuser: action.getuser};
<<<<<<< HEAD
    case actionTypes.IS_AUTHENTICATED:
      return {...state, is_authenticated: action.is_authenticated}
=======
    case actionTypes.CHANGE_PASSWORD:
      return {...state, getuser: action.getuser};
>>>>>>> 5daa001be112331fc66391880e5f605d48d5af6d
  }
  return state;
};

export default reducer;