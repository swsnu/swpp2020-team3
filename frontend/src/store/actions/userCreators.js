import * as actionTypes from './actionTypes';
import axios from 'axios';

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
      .catch(function() {
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
      .then(() => {
        dispatch(signIn_(userCredentials));
        return true;
      }).catch(function() {
        return false;
      })
  }
}

/*
const signOut_ = () => {
  return {type: actionTypes.LOGOUT}
}
*/

export const signOut = () => {
  return () => {
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

const isLogin_ = (login_id) => {
  return {type: actionTypes.IS_AUTHENTICATED, login_id}
}
export const isLogin = () => {
  return dispatch => {
    return axios.get('/api/curuser/')
    .then(res => dispatch(isLogin_(res.data)))
}}

const changePassword_ = (userCredentials) => {
  return { type: actionTypes.CHANGE_PASSWORD, getuser: userCredentials};
};
export const changePassword = (userCredentials) => {
  return dispatch => {
    return axios.put('/api/getuser/'+userCredentials.id+'/',{password: userCredentials.new_password})
    .then(res => dispatch(changePassword_(res.data)))
  }
}