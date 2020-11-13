import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { history, middlewares } from '../store/store';

const mockFunction = jest.fn(
  initialState => (state = initialState, action) => {
    switch (action.type) {
      default:
        break;
    }
    return state;
  }
);

export const getMockStore = (initialState) => {
  const mockUsersReducer = mockFunction(initialState);
  //const mockUsersReducer = mockFunction(initialState);
  const mockRecipeReducer = mockFunction(initialState);
  const mockCommentReducer = mockFunction(initialState);
  const mockReplyReducer = mockFunction(initialState);
  const rootReducer = combineReducers({
    users: mockUsersReducer,
    rcp: mockRecipeReducer,
    recipe: mockRecipeReducer,
    comment: mockCommentReducer,
    reply: mockReplyReducer,
    router: connectRouter(history),
  });
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const mockStore = createStore(rootReducer,
    composeEnhancers(applyMiddleware(...middlewares)));
  return mockStore;
}