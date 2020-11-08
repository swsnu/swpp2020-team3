import * as actionTypes from './actionTypes';
import { push } from 'connected-react-router';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


const getReplies_ = (replies) => {
    console.log(replies)
  return { type: actionTypes.GET_REPLIES, replies: replies };
};

export const getReplies = (commentId) => {
  return dispatch => {
    return axios.get('/api/comment/' + commentId + '/reply/')
      .then(res => dispatch(getReplies_(res.data)));
  };
};

export const getReplySet = (comment_id_list) => {
  let replies=[];
  return dispatch => {
    for(let id of comment_id_list){
      axios.get('/api/comment/'+id+'/reply/')
        .then(res => {
          replies=[...replies, ...res.data]
          if(id==comment_id_list[comment_id_list.length-1]){
            dispatch(getReplies_(replies))
          }
        })
    }
  }
}

const addReply_ = (reply) => {
  return { type: actionTypes.ADD_REPLY, reply: reply}
}

export const addReply = (reply) => {
  return dispatch => {
    return axios.post('/api/comment/'+reply.commentId+'/reply/', reply)
      .then(res => dispatch(addReply_(res.data)))
  }
}
const editReply_ = (reply) => {
  return {type: actionTypes.EDIT_REPLY, reply: reply}
}

export const editReply = (reply) => {
  return dispatch => {
    return axios.put('/api/reply/'+reply.id+'/', reply)
      .then(res => {
        console.log(res)
        dispatch(editReply_(res.data))
      })
  }
}

const deleteReply_ = (id) => {
  return {type: actionTypes.DELETE_REPLY, id};
}

export const deleteReply = (id) => {
  return dispatch => {
    return axios.delete('/api/reply/'+id+'/')
      .then(res => dispatch(deleteReply_(id)))
  }
}