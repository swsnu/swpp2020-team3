import axios from 'axios';
// import * as router from 'connected-react-router';

import * as actionCreators from './comment';
import store from '../store';

const stubComment = {id: 1, author_id: 1, title: "TEST_ARTICLE_TITLE", content: 'TEST_ARTICLE_CONTENT'};
const newStubComment= {id: 1, author_id: 1, title: "NEW_TEST_ARTICLE_TITLE", content: 'NEW_TEST_ARTICLE_CONTENT'};

describe('comment', () => {
  afterEach(() => {
    jest.clearAllMocks();
  })

  it(`'getComments' should fetch articles correctly`, (done) => {
    const stubCommentList = [stubComment];

    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubCommentList
          };
          resolve(result);
        });
      })

    store.dispatch(actionCreators.getComments()).then(() => {
      const newState = store.getState();
      expect(newState.comment.comments).toBe(stubCommentList);
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });


  it(`'deleteComment' should delete article correctly`, (done) => {
    const spy = jest.spyOn(axios, 'delete')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: null,
          };
          resolve(result);
        });
      })

    store.dispatch(actionCreators.deleteComment(1)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'addComment' should add article correctly`, (done) => {
    const spy = jest.spyOn(axios, 'post')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubComment,
          };
          resolve(result);
        });
      })

      store.dispatch(actionCreators.addComment(stubComment)).then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it(`'editComment' should edit article correctly`, (done) => {
    const spy = jest.spyOn(axios, 'put')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubComment,
          };
          resolve(result);
        });
      })

    store.dispatch(actionCreators.editComment(newStubComment)).then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        done();
    });
  });



});