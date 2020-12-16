import * as actionTypes from '../actions/actionTypes';

const initialState = {
  currentUser: {},
  getuser: null,
  login_id: null,
  planner: null,
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
    case actionTypes.FOLLOW_USER:
      return {...state, getuser: action.getuser};
    case actionTypes.UNFOLLOW_USER:
      return {...state, getuser: action.getuser};
    case actionTypes.IS_AUTHENTICATED:
      return {...state, login_id: action.login_id}
    case actionTypes.CHANGE_PASSWORD:
      return {...state, getuser: action.getuser};
    case actionTypes.LOAD_PLANNER:
      return {...state, planner: action.planner};
    case actionTypes.SAVE_PLANNER:
      return {...state, getUser: {...state.getUser, planner: action.planner}};
  }
  return state;
};

export default reducer;