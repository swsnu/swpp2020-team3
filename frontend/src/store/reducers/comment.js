import * as actionTypes from '../actions/actionTypes';

const initialState = {
  comments: [
  ],
  selectedComment: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_COMMENTS:
      return { ...state, comments: action.comments };
    case actionTypes.ADD_COMMENT:
      const newComment={
        content: action.comment.content,
        recipe_id: action.comment.recipeId,
        edited: false,
        author_id: action.comment.author_id,
        id: action.comment.id
      }
      return {...state, comments: [...state.comments, newComment]}
    case actionTypes.EDIT_COMMENT:
      const afterEdited = state.comments.map((item) => {
        if(item.id==action.comment.id){
          return {...item, content: action.comment.content};
        }
        else {
          return item;
        }
      })
      return { ...state, comments: afterEdited}
    case actionTypes.DELETE_COMMENT:
      const deleted = state.comments.filter((comment) => comment.id!=action.id)
      return {...state, comments: deleted}
    default:
      break;
  }
  return state;
};

export default reducer;