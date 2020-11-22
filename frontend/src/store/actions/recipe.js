import * as actionTypes from './actionTypes';
import { push } from 'connected-react-router';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const getRandom_ = (recipe) => {
  return {type: actionTypes.GET_RANDOM, randomRecipe: recipe}
};
export const getRandom = () => {
  return dispatch => {
    return axios.get('api/random/')
      .then(res => dispatch(getRandom_(res.data)))
  }
}

const getHot_ = (recipe) => {
  return {type: actionTypes.GET_HOT, hotRecipe: recipe}
};
export const getHot = () => {
  return dispatch => {
    return axios.get('api/hot/')
      .then(res => dispatch(getHot_(res.data)))
  }
}

const getRecipes_ = (recipes) => {
  return { type: actionTypes.GET_RECIPES, recipes: recipes };
};

/*
export const getRecipes = (pageID, searchMode) => {
  return dispatch => {
    return axios.get('/recipe/',pageID)
      .then(res => dispatch(getRecipes_(res.data)));
  };
};
*/
const getRecipe_ = (recipe) => {
  return {type: actionTypes.GET_RECIPE, selectedRecipe: recipe};
}

export const getRecipe = (id) => {
  return dispatch => {
    return axios.get('/api/recipe/'+id+'/')
      .then(res => dispatch(getRecipe_(res.data)))
  }
}
//     return axios.get('api/recipepage/'+pageID+'/'+searchMode+'/')
//       .then(res => dispatch(getRecipes_(res.data)));
//   };
// };


export const getRecipes = (searchSettings) => {
  return dispatch => {
    return axios.get('api/recipepage/', {
      params: searchSettings
    }).then(res => dispatch(getRecipes_(res.data)));
  };
};

const deleteRecipe_ = (id) => {
  return {type: actionTypes.DELETE_RECIPE, id: id}
}

export const deleteRecipe = (id) => {
  return dispatch => {
    return axios.delete('/api/recipe/'+id+'/')
      .then(() => dispatch(deleteRecipe_(id)))
      .then(() => dispatch(push('/main-page/')))
  }
}

const createRecipe_ = (recipe) => {
  return {type: actionTypes.CREATE_RECIPE, selectedRecipe: recipe}
};
export const createRecipe = (recipe) => {
  return dispatch => {
    return axios.post('/api/recipe/', recipe)
      .then(res => dispatch(createRecipe_(res.data)))
  }
}

const editRecipe_ = (recipe) => {
  return {type: actionTypes.EDIT_RECIPE, modifiedRecipe: recipe}
}
export const editRecipe = (recipe, id) => {
  return dispatch => {
    return axios.put(`/api/recipe/${id}/`, recipe)
      .then(res => dispatch(editRecipe_(res.data)))
  }
}

const getIngredients_ = (result) => {
  return {type: actionTypes.GET_INGREDIENTS, ingredients: result}
}
export const getIngredients = () => {
  return dispatch => {
    return axios.get('/api/ingredient/')
      .then(res => {
        return dispatch(getIngredients_(res.data));
        
      })
  }
}

// get entire list of scrapped articles of logged in user
const getScrappedRecipes_ = (result) => {
  return {type: actionTypes.GET_RECIPES, list: result}
}
export const getScrappedRecipes = () => {
  return dispatch => {
    return axios.get('/api/scrapped-article-list')
      .then(res => {
        return dispatch(getScrappedRecipes_(res.data))
      })
  }
}

const getMLRecipes_ = (result) => {
  return {type: actionTypes.GET_ML_RECIPES, list: result}
}
export const getMLRecipes = () => {
  return dispatch => {
    return axios.get('/api/mltempurl')
      .then(res => {
        return dispatch(getMLRecipes_(res.data))
      })
  }
}


/*
export const getRecipes = (pageID, searchMode) => {
  return dispatch => {
    return axios.get('api/recipepage/'+pageID+'/'+searchMode+'/')
      .then(res => dispatch(getRecipes_(res.data)));
  };
};
*/
