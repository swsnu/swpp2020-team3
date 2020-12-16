import * as actionTypes from './actionTypes';
import { push } from 'connected-react-router';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const getMl_ = (recipe) => {
  return {type: actionTypes.GET_ML_RECIPES, mlRecipes: recipe}
};
export const getMl = (id) => {
  return dispatch => {
    return axios.get('api/getml/'+id+'/').then(res=> dispatch(getMl_(res.data)))
  }
}


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
	console.log(recipe);
  return {type: actionTypes.EDIT_RECIPE, modifiedRecipe: recipe}
}
export const editRecipe = (recipe, id) => {
	console.log(recipe);
	console.log(id);
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

const likeRecipe_ = (id) => {
  return {type: actionTypes.LIKE_RECIPE, id}
}
export const likeRecipe = (id) => {
  return dispatch => {
    return axios.post('/api/recipe/'+id+'/like/')
      .then(res => {
        dispatch(likeRecipe_(res.data))
      })
  }
}

const removelikeRecipe_ = (id) => {
  return {type: actionTypes.REMOVE_LIKE_RECIPE, id}
}
export const removelikeRecipe = (id) => {
  return dispatch => {
    return axios.post('/api/recipe/'+id+'/removelike/')
      .then(res => {
        dispatch(removelikeRecipe_(res.data))
      })
  }
}

const scrapRecipe_ = (id) => {
  return {type: actionTypes.SCRAP_RECIPE, id}
}
export const scrapRecipe = (id) => {
  return dispatch => {
    return axios.post('/api/recipe/'+id+'/scrap/')
      .then(res => {
        dispatch(scrapRecipe_(res.data))
      })
  }
}

const removescrapRecipe_ = (id) => {
  return {type: actionTypes.REMOVE_SCRAP_RECIPE, id}
}
export const removescrapRecipe = (id) => {
  return dispatch => {
    return axios.post('/api/recipe/'+id+'/removescrap/')
      .then(res => {
        dispatch(removescrapRecipe_(res.data))
      })
  }
}

const getRating_ = (data) => {
  console.log(data)
  return {type: actionTypes.GET_RECIPE_RATING, rating: data}
}
export const getRating = (id) => {
  return dispatch => {
    return axios.get(`/api/recipe/${id}/rating/`)
      .then(res => {
        dispatch(getRating_(res.data))
      })
  }
}

const addRating_ = (data) => {
  console.log(data)
  return {type: actionTypes.ADD_RECIPE_RATING, data}
}
export const addRating = (id, rating) => {
  console.log(id)
  console.log(typeof rating)
  return dispatch => {
    return axios.post(`/api/recipe/${id}/rating/`, {rating: rating})
      .then(res => {
        dispatch(addRating_(res.data))
      })
  }
}
