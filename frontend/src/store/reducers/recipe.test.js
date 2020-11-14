import reducer from './recipe';
import * as actionTypes from '../actions/actionTypes';

const stubRecipe = {id: 1, author_id: 1, title: "TEST_ARTICLE_TITLE", content: 'TEST_ARTICLE_CONTENT'};

describe('Recipe Reducer', () => {
  it('should return default state', () => {
    const newState = reducer(undefined, {}); // initialize
    expect(newState).toEqual({recipes: [], selectedRecipe: null, ingredientList:[], randomRecipe: null});
  });

  it('should get all Recipes', () => {
    const stubRecipeList = [
        {id: 1, author_id: 1, title: "TEST_ARTICLE_TITLE1", content: 'TEST_ARTICLE_CONTENT1'},
        {id: 2, author_id: 2, title: "TEST_ARTICLE_TITLE2", content: 'TEST_ARTICLE_CONTENT2'},
    ];
    const newState = reducer(undefined, {
      type: actionTypes.GET_RECIPES,
      recipes: stubRecipeList,
    });
    expect(newState).toEqual({
      recipes: stubRecipeList,
      selectedRecipe: null,
      ingredientList: [],
      randomRecipe: null
    });
  });

  it('should get Recipe', () => {
    const newState = reducer(undefined, {
      type: actionTypes.GET_RECIPE,
      selectedRecipe: stubRecipe,
    });
    expect(newState).toEqual({
      recipes: [],
      selectedRecipe: stubRecipe,
      ingredientList: [],
      randomRecipe: null
    });
  });

  it('should delete Recipe', () => {
    const stubRecipeList = [
        {id: 1, author_id: 1, title: "TEST_ARTICLE_TITLE1", content: 'TEST_ARTICLE_CONTENT1'},
        {id: 2, author_id: 2, title: "TEST_ARTICLE_TITLE2", content: 'TEST_ARTICLE_CONTENT2'},
    ];
    const stubInitialState = {
        recipes: stubRecipeList,
        selectedRecipe: null,
        ingredientList: [],
        randomRecipe: null
    };
    const newState = reducer(stubInitialState, {
      type: actionTypes.DELETE_RECIPE,
      id: 1,
    });
    expect(newState).toEqual({
      recipes: [{id: 2, author_id: 2, title: "TEST_ARTICLE_TITLE2", content: 'TEST_ARTICLE_CONTENT2'},],
      selectedRecipe: null,
      ingredientList: [],
      randomRecipe: null
    });
  });

  it('should create Recipes', () => {
    const stubInitialState = {
        recipes: [],
        selectedRecipe: null,
        ingredientList: [],
        randomRecipe: null
    };
    const newState = reducer(stubInitialState, {
      type: actionTypes.CREATE_RECIPE,
    });
    expect(newState).toEqual({
      recipes: [],
      selectedRecipe: null,
      ingredientList: [],
      randomRecipe: null
    });
  });

  it('should get random Recipes', () => {
    const stubInitialState = {
        recipes: [],
        selectedRecipe: null,
        ingredientList: [],
        randomRecipe: null
    };
    const newState = reducer(stubInitialState, {
      type: actionTypes.GET_RANDOM,
      randomRecipe: stubRecipe,
    });
    expect(newState).toEqual({
      recipes: [],
      selectedRecipe: null,
      ingredientList: [],
      randomRecipe: stubRecipe,
    });
  });

  it('should get ingredients', () => {
    const stubIngredientList = [
        {id: 1, author_id: 1, title: "TEST_ARTICLE_TITLE1", content: 'TEST_ARTICLE_CONTENT1'},
        {id: 2, author_id: 2, title: "TEST_ARTICLE_TITLE2", content: 'TEST_ARTICLE_CONTENT2'},
    ];
    const stubInitialState = {
        recipes: [],
        selectedRecipe: null,
        ingredientList: [],
        randomRecipe: null
    };
    const newState = reducer(stubInitialState, {
      type: actionTypes.GET_INGREDIENTS,
      ingredients: stubIngredientList
    });
    expect(newState).toEqual({
      recipes: [],
      selectedRecipe: null,
      ingredientList: stubIngredientList,
      randomRecipe: null
    });
  });
  

})