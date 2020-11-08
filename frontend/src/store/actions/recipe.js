import * as actionTypes from './actionTypes';
import { push } from 'connected-react-router';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


const getRecipes_ = (recipes) => {
  return { type: actionTypes.GET_RECIPES, recipes: recipes };
};

/*
export const getRecipes = (pageID, searchMode) => {
  return dispatch => {
    return axios.get('api/recipepage/'+pageID+'/'+searchMode+'/')
      .then(res => dispatch(getRecipes_(res.data)));
  };
};
*/

export const getRecipes = (searchSettings) => {
  return dispatch => {
    return axios.get('api/recipepage/', {
      params: searchSettings
    }).then(res => dispatch(getRecipes_(res.data)));
  };
};

const createRecipe_ = (recipe) => {
  return {type: actionTypes.CREATE_RECIPE}
};
export const createRecipe = (recipe) => {
  return dispatch => {
    return axios.post('api/recipe/', recipe)
      .then(res => dispatch(createRecipe_(res.data)))
  }
}

const getIngredients_ = (result) => {
  console.log(result)
  return {type: actionTypes.GET_INGREDIENTS, ingredients: result}
}
export const getIngredients = () => {
  return dispatch => {
    return axios.get('api/ingredient/')
      .then(res => {
        dispatch(getIngredients_(res.data))})
  }
}
