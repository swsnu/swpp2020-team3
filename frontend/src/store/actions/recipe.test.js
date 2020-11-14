import axios from 'axios';
// import * as router from 'connected-react-router';

import * as actionCreators from './recipe';
import store from '../store';

const stubRecipe = {id: 1, author_id: 1, title: "TEST_ARTICLE_TITLE", content: 'TEST_ARTICLE_CONTENT'};
const newStubRecipe= {id: 1, author_id: 1, title: "NEW_TEST_ARTICLE_TITLE", content: 'NEW_TEST_ARTICLE_CONTENT'};

describe('rcp', () => {
  afterEach(() => {
    jest.clearAllMocks();
  })

  it(`'getRecipes' should fetch articles correctly`, (done) => {
    const stubRecipeList = [stubRecipe];

    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubRecipeList
          };
          resolve(result);
        });
      })

    store.dispatch(actionCreators.getRecipes()).then(() => {
      const newState = store.getState();
      expect(newState.rcp.recipes).toBe(stubRecipeList);
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'getRecipe' should fetch article correctly`, (done) => {
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubRecipe
          };
          resolve(result);
        });
      })

    store.dispatch(actionCreators.getRecipe()).then(() => {
      const newState = store.getState();
      expect(newState.rcp.selectedRecipe).toBe(stubRecipe);
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'deleteRecipe' should delete article correctly`, (done) => {
    const spy = jest.spyOn(axios, 'delete')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: null,
          };
          resolve(result);
        });
      })

    store.dispatch(actionCreators.deleteRecipe(1)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'createRecipe' should delete article correctly`, (done) => {
    const spy = jest.spyOn(axios, 'post')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubRecipe,
          };
          resolve(result);
        });
      })

    store.dispatch(actionCreators.createRecipe()).then(() => {
        const newState = store.getState();
        expect(newState.rcp.selectedRecipe).toBe(stubRecipe);
        expect(spy).toHaveBeenCalledTimes(1);
        done();
    });
  });

  it(`'getIngredients' should delete article correctly`, (done) => {
    const stubIngredientList = [stubRecipe];
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubIngredientList,
          };
          resolve(result);
        });
      })

      store.dispatch(actionCreators.getIngredients()).then(() => {
        const newState = store.getState();
        expect(newState.rcp.ingredientList).toBe(stubIngredientList);
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it(`'getRandom' should delete article correctly`, (done) => {
    const stubRandomList = [stubRecipe];
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubRandomList,
          };
          resolve(result);
        });
      })

      store.dispatch(actionCreators.getRandom()).then(() => {
        const newState = store.getState();
        expect(newState.rcp.randomRecipe).toBe(stubRandomList);
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });


});