import * as actionTypes from '../actions/actionTypes';

const initialState = {
  recipes: [
  ],
  selectedRecipe: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_RECIPES:
      return { ...state, recipes: action.recipes };
    case actionTypes.CREATE_RECIPE:
      return {...state};
    default:
      break;
  }
  return state;
};

export default reducer;