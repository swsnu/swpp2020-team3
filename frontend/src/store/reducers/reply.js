import * as actionTypes from '../actions/actionTypes';

const initialState = {
  replies: [
  ],
  selectedReply: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_REPLIES:
      return { ...state, replies: action.replies };
    case actionTypes.ADD_REPLY:
      const newReply={
        content: action.reply.content,
        comment_id: action.reply.comment_id,
        edited: false,
        author_id: action.reply.author_id,
        id: action.reply.id
      }
      console.log(newReply)
      return {...state, replies: [...state.replies, newReply]}
    case actionTypes.EDIT_REPLY:
      console.log(123)
      const afterEdited = state.replies.map((item) => {
        if(item.id==action.reply.id){
          return {...item, content: action.reply.content};
        }
        else {
          return item;
        }
      })
      return { ...state, replies: afterEdited}
    case actionTypes.DELETE_REPLY:
      const deleted = state.replies.filter((reply) => reply.id!=action.id)
      return {...state, replies: deleted}
    default:
      break;
  }
  return state;
};

export default reducer;