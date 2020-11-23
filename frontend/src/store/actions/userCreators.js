import * as actionTypes from './actionTypes';
import axios from 'axios';
import { push } from 'connected-react-router';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


const signUp_ = (userCredentials) => {
  return { type: actionTypes.SIGN_UP, user: userCredentials};
};
export const signUp = (userCredentials) => {
  return dispatch => {
    return axios.post('api/signup/', userCredentials)
      .then(res => {
        dispatch(signUp_(res.data));
        return true;
      })
      .catch(function(error) {
        return false;
      })
  };
};

const signIn_ = (userCredentials) => {
  return {type: actionTypes.LOGIN, user: userCredentials};
};
export const signIn = (userCredentials) => {
  return dispatch => {
    return axios.post('api/signin/', userCredentials)
      .then(res => {
        dispatch(signIn_(userCredentials));
        return true;
      }).catch(function(error) {
        return false;
      })
  }
}

const signOut_ = () => {
  return {type: actionTypes.LOGOUT}
}

export const signOut = () => {
  return dispatch => {
    return axios.get('/api/signout/')
    .then(res => console.log(res))
  }
}

const getUser_ = (userCredentials) => {
  return { type: actionTypes.GET_USER, getuser: userCredentials};
};
export const getUser = (id) => {
  return dispatch => {
    return axios.get('/api/getuser/'+id)
    .then(res => dispatch(getUser_(res.data)))
  }
}

const isLogin_ = (is_authenticated) => {
  return {type: actionTypes.IS_AUTHENTICATED, is_authenticated}
}
export const isLogin = () => {
  return dispatch => {
    return axios.get('/api/curuser/')
    .then(res => dispatch(isLogin_(res.data)))
  }
}