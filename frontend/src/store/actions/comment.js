import * as actionTypes from './actionTypes';
import { push } from 'connected-react-router';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


const getComments_ = (comments) => {
  return { type: actionTypes.GET_COMMENTS, comments: comments };
};

export const getComments = (recipeId) => {
  return dispatch => {
    return axios.get('/api/recipe/' + recipeId + '/comment/')
      .then(res => dispatch(getComments_(res.data)));
  };
};

const addComment_ = (comment) => {
  return { type: actionTypes.ADD_COMMENT, comment: comment}
}

export const addComment = (comment) => {
  return dispatch => {
    return axios.post('/api/recipe/'+comment.recipeId+'/comment/', comment)
      .then(res => dispatch(addComment_(res.data)))
  }
}
const editComment_ = (comment) => {
  return {type: actionTypes.EDIT_COMMENT, comment: comment}
}

export const editComment = (comment) => {
  return dispatch => {
    return axios.put('/api/comment/'+comment.id, comment)
      .then(res => dispatch(editComment_(comment)))
  }
}

const deleteComment_ = (id) => {
  return {type: actionTypes.DELETE_COMMENT, id};
}

export const deleteComment = (id) => {
  return dispatch => {
    return axios.delete('/api/comment/'+id)
      .then(res => dispatch(deleteComment_(id)))
  }
}