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

    case actionTypes.GET_RECIPE:
      return { ...state, selectedRecipe: action.recipe};

    default:
      break;
  }
  return state;
};

export default reducer;