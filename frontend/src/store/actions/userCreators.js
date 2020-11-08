import * as actionTypes from './actionTypes';
import { push } from 'connected-react-router';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


const signUp_ = (userCredentials) => {
  return { type: actionTypes.SIGN_UP, user: userCredentials};
};
export const signUp = (userCredentials) => {
  return dispatch => {
    return axios.post('api/signup/', userCredentials)
      .then(res => dispatch(signUp_(res.data)));
  };
};

const signIn_ = (userCredentials) => {
  return {type: actionTypes.LOGIN, user: userCredentials};
};
export const signIn = (userCredentials) => {
  return dispatch => {
    return axios.post('api/signin/', userCredentials)
      .then(res => dispatch(signIn_(res.data)))
  }
}


const getUser_ = (userCredentials) => {
  console.log(userCredentials)
  return { type: actionTypes.GET_USER, getuser: userCredentials};
};
export const getUser = (id) => {
  return dispatch => {
    return axios.get('api/getuser/'+id)
    .then(res => dispatch(getUser_(res.data)))
  }
}
