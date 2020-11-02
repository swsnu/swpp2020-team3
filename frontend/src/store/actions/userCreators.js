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

const logIn_ = (userCredentials) => {
  return {type: actionTypes.LOGIN, user: userCredentials};
};
export const logIn = (userCredentials) => {
  
}