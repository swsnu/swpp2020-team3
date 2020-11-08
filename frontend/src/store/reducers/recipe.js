import * as actionTypes from '../actions/actionTypes';

const initialState = {
  recipes: [],
  selectedRecipe: null,
  ingredientList: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_RECIPES:
      return { ...state, recipes: action.recipes };
    case actionTypes.GET_RECIPE:
      return { ...state, selectedRecipe: action.recipe};
    case actionTypes.CREATE_RECIPE:
      return {...state};
    case actionTypes.GET_INGREDIENTS:
      return {...state, ingredientList: action.ingredients}
    default:
      break;
  }
  return state;
};

export default reducer;