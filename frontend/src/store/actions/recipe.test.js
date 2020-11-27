import axios from 'axios';
// import * as router from 'connected-react-router';

import * as actionCreators from './recipe';
import store from '../store';

const stubRecipe = {id: 1, author_id: 1, title: "TEST_ARTICLE_TITLE", content: 'TEST_ARTICLE_CONTENT', likes: 0, liked_user: [], scrapped_user: []};

describe('rcp', () => {
  afterEach(() => {
    jest.clearAllMocks();
  })

  it(`'getRecipes' should fetch articles correctly`, (done) => {
    const stubRecipeList = [stubRecipe];

    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(() => {
        return new Promise((resolve) => {
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
      .mockImplementation(() => {
        return new Promise((resolve) => {
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
      .mockImplementation(() => {
        return new Promise((resolve) => {
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

  it(`'editRecipe' should delete article correctly`, (done) => {
    const spy = jest.spyOn(axios, 'put')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubRecipe,
          };
          resolve(result);
        });
      })

    store.dispatch(actionCreators.editRecipe(stubRecipe,1)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'createRecipe' should delete article correctly`, (done) => {
    const spy = jest.spyOn(axios, 'post')
      .mockImplementation(() => {
        return new Promise((resolve) => {
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
      .mockImplementation(() => {
        return new Promise((resolve) => {
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
      .mockImplementation(() => {
        return new Promise((resolve) => {
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

  it(`'getScrappedRecipes' should delete article correctly`, (done) => {
    const stubMLList = [stubRecipe];
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubMLList,
          };
          resolve(result);
        });
      })

      store.dispatch(actionCreators.getScrappedRecipes()).then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it(`'getMLRecipes' should delete article correctly`, (done) => {
    const stubMLList = [stubRecipe];
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubMLList,
          };
          resolve(result);
        });
      })

      store.dispatch(actionCreators.getMLRecipes()).then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it(`'getHot' should delete article correctly`, (done) => {
    const stubHotList = [stubRecipe];
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubHotList,
          };
          resolve(result);
        });
      })

      store.dispatch(actionCreators.getHot()).then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it(`'likeRecipe' should delete article correctly`, (done) => {
    const spy = jest.spyOn(axios, 'post')
      .mockImplementation((id) => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubRecipe,
          };
          resolve(result);
        });
      })

    store.dispatch(actionCreators.likeRecipe(1)).then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        done();
    });
  });

  it(`'removelikeRecipe' should delete article correctly`, (done) => {
    const spy = jest.spyOn(axios, 'post')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: null,
          };
          resolve(result);
        });
      })

    store.dispatch(actionCreators.removelikeRecipe(1)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'scrapRecipe' should delete article correctly`, (done) => {
    const spy = jest.spyOn(axios, 'post')
      .mockImplementation((id) => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubRecipe,
          };
          resolve(result);
        });
      })

    store.dispatch(actionCreators.scrapRecipe(1)).then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        done();
    });
  });

  it(`'removescrapRecipe' should delete article correctly`, (done) => {
    const spy = jest.spyOn(axios, 'post')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: null,
          };
          resolve(result);
        });
      })

    store.dispatch(actionCreators.removescrapRecipe(1)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });


});