import * as actionTypes from '../actions/actionTypes';

const initialState = {
  recipes: [],
  selectedRecipe: null,
  ingredientList: [],
  randomRecipe: null,
  hotRecipe: null,
  mlRecipe: [],
};

const reducer = (state = initialState, action) => {
  let add_liked_user, add_scrapped_user, remove_scrapped_user, remove_liked_user;
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
    case actionTypes.LIKE_RECIPE:
      add_liked_user = state.selectedRecipe.liked_user.concat(action.id);
      return {...state, selectedRecipe: {...state.selectedRecipe, likes: state.selectedRecipe.likes+1, liked_user: add_liked_user}}
    case actionTypes.REMOVE_LIKE_RECIPE:
      remove_liked_user = state.selectedRecipe.liked_user.filter((id) => id!=action.id);
      return {...state, selectedRecipe: {...state.selectedRecipe, likes: state.selectedRecipe.likes-1, liked_user: remove_liked_user}}
    case actionTypes.SCRAP_RECIPE:
      add_scrapped_user = state.selectedRecipe.scrapped_user.concat(action.id);
      return {...state, selectedRecipe: {...state.selectedRecipe, scrapped_user: add_scrapped_user}}
    case actionTypes.REMOVE_SCRAP_RECIPE:
      remove_scrapped_user = state.selectedRecipe.scrapped_user.filter((id) => id!=action.id);
      return {...state, selectedRecipe: {...state.selectedRecipe, scrapped_user: remove_scrapped_user}}
    default:
      break;
  }
  return state;
};

export default reducer;