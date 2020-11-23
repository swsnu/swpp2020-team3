import * as actionTypes from '../actions/actionTypes';

const initialState = {
  recipes: [],
  selectedRecipe: null,
  ingredientList: [],
  randomRecipe: null,
  hotRecipe: null,
};

const reducer = (state = initialState, action) => {
  let afterDeleted;
  switch (action.type) {
    case actionTypes.GET_RECIPE:
      return {...state, selectedRecipe: action.selectedRecipe}
    case actionTypes.GET_RECIPES:
      return { ...state, recipes: action.recipes };
    case actionTypes.DELETE_RECIPE:
      afterDeleted = state.recipes.filter((item) => item.id!=action.id);
      return { ...state, recipes: afterDeleted}
    case actionTypes.CREATE_RECIPE:
      return {...state};
    case actionTypes.GET_INGREDIENTS:
      return {...state, ingredientList: action.ingredients}
    case actionTypes.GET_RANDOM:
      return {...state, randomRecipe: action.randomRecipe};
    case actionTypes.GET_HOT:
      return {...state, hotRecipe: action.hotRecipe};
    case actionTypes.EDIT_RECIPE:
      return {...state, selectedRecipe: action.modifiedRecipe}
    default:
      break;
  }
  return state;
};

export default reducer;