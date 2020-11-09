import * as actionTypes from '../actions/actionTypes';

const initialState = {
  recipes: [],
  selectedRecipe: null,
  ingredientList: [],
  randomRecipe: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_RECIPE:
      return {...state, selectedRecipe: action.selectedRecipe}
    case actionTypes.GET_RECIPES:
      return { ...state, recipes: action.recipes };
    case actionTypes.CREATE_RECIPE:
      return {...state};
    case actionTypes.GET_INGREDIENTS:
      return {...state, ingredientList: action.ingredients}
    case actionTypes.GET_RANDOM:
      return {...state, randomRecipe: action.randomRecipe}
    default:
      break;
  }
  return state;
};

export default reducer;