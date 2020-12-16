import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';

import RecipeList from './RecipeList';
import { getMockStore } from '../../test-utils/mocks';
import { history } from '../../store/store';
import * as actionCreators from '../../store/actions/recipe';

jest.mock('../../components/Recipe/Recipe', () => {
  return jest.fn(props => {
    return (
      <div className="spyRecipe">
        <div className = 'title'>
          {props.title}
        </div>
        <button className = 'spyButton' onClick = {props.clickedRecipe} />
      </div>);
  });
});

let recipePage=[];
for(let i=1;i<=51;i++){
  recipePage.push({id: i, author:'author'+i , title:'title'+i, price: 'price'+i, rating: 'rating'+i, likes: 'likes'+i, thumbnail: ''})
}

const stubInitialState = {
  recipes : recipePage,
};
const mockStore = getMockStore(stubInitialState);

describe('<RecipeList />', () => {
    let recipeList, spyGetRecipes;
    beforeEach(() => {  
        recipeList = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                <Switch>
                    <Route path='/' component = {RecipeList} />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
        spyGetRecipes = jest.spyOn(actionCreators, 'getRecipes')
        .mockImplementation(() => { return () => {}; });
    });

    afterEach(() => {
      jest.clearAllMocks();
    })

    it('should render Recipes', () => {
        const component = mount(recipeList);
        let wrapper = component.find('.spyRecipe');
        expect(wrapper.length).toBe(10);
        expect(spyGetRecipes).toBeCalledTimes(1);
    });

    it(`should set state properly on given inputs(time, cost, keywords)`, () => {
        const numberMin = 20, numberMax=100, keywords='asdf';
        const component = mount(recipeList);
        let wrapper = component.find('.min-cost-input');
        expect(wrapper.length).toBe(1);
        wrapper.simulate('change', { target: { value: numberMin } });
        wrapper = component.find('.max-cost-input');
        wrapper.simulate('change', { target: { value: numberMax } });
        wrapper = component.find('.min-time-input');
        wrapper.simulate('change', { target: { value: numberMin } });
        wrapper = component.find('.max-time-input');
        wrapper.simulate('change', { target: { value: numberMax } });
        wrapper = component.find('.search-word-input');
        wrapper.simulate('change', { target: { value: keywords } });
        let newRecipeInstance = component.find(RecipeList.WrappedComponent).instance();
        expect(newRecipeInstance.state.tempSearchSettings.minPrice).toEqual(numberMin);
        expect(newRecipeInstance.state.tempSearchSettings.maxPrice).toEqual(numberMax);
        expect(newRecipeInstance.state.tempSearchSettings.minDuration).toEqual(numberMin);
        expect(newRecipeInstance.state.tempSearchSettings.maxDuration).toEqual(numberMax);
        expect(newRecipeInstance.state.tempSearchSettings.searchWord).toEqual('asdf');
    });
    
    it(`should call 'cancelArticleHandler'`, () => {
      const spyHistoryPush = jest.spyOn(history, 'push')
        .mockImplementation(() => {});
      const component = mount(recipeList);
      const wrapper = component.find('.spyButton');
      wrapper.at(0).simulate('click');
      expect(spyHistoryPush).toHaveBeenCalledTimes(1);
    });

    it(`should render pages`, () => {
      const component = mount(recipeList);
      let newRecipeInstance = component.find(RecipeList.WrappedComponent).instance();
      let wrapper = component.find('.list-page-number-button');
      expect(wrapper.length).toBe(5);
      wrapper.at(0).simulate('click');
      expect(newRecipeInstance.state.searchSettings.pageNumber).toEqual(1);
      //expect(wrapper.at(0).props('style')).toHaveProperty('',{"backgroundColor": "grey"});
      wrapper.at(1).simulate('click');
      expect(newRecipeInstance.state.searchSettings.pageNumber).toEqual(2);
      //expect(wrapper.at(1).props('style')).toHaveProperty('backgroundColor','grey');
      wrapper.at(2).simulate('click');
      expect(newRecipeInstance.state.searchSettings.pageNumber).toEqual(3);
      //expect(wrapper.at(2).props('style')).toHaveProperty('backgroundColor','grey');
      wrapper.at(3).simulate('click');
      expect(newRecipeInstance.state.searchSettings.pageNumber).toEqual(4);
      //expect(wrapper.at(3).props('style')).toHaveProperty('backgroundColor','grey');
      wrapper.at(4).simulate('click');
      expect(newRecipeInstance.state.searchSettings.pageNumber).toEqual(5);
      //expect(wrapper.at(4).props('style')).toHaveProperty('backgroundColor','grey');

      wrapper = component.find('.list-page-next-button');
      wrapper.simulate('click');
      expect(newRecipeInstance.state.searchSettings.pageNumber).toEqual(6);

      wrapper = component.find('.list-page-previous-button');
      wrapper.simulate('click');
      expect(newRecipeInstance.state.searchSettings.pageNumber).toEqual(1);
  });
    
    it(`should render categories`, () => {
        const component = mount(recipeList);
        let wrapper = component.find('.category-select-button');
        let newRecipeInstance = component.find(RecipeList.WrappedComponent).instance();
        expect(wrapper.length).toBe(6);
        wrapper.at(0).simulate('click');
        expect(newRecipeInstance.state.tempSearchSettings.American).toEqual(false);
        wrapper.at(1).simulate('click');
        expect(newRecipeInstance.state.tempSearchSettings.Korean).toEqual(false);
        wrapper.at(2).simulate('click');
        expect(newRecipeInstance.state.tempSearchSettings.Chinese).toEqual(false);
        wrapper.at(3).simulate('click');
        expect(newRecipeInstance.state.tempSearchSettings.Japanese).toEqual(false);
        wrapper.at(4).simulate('click');
        expect(newRecipeInstance.state.tempSearchSettings.ConvenienceStore).toEqual(false);
        wrapper.at(5).simulate('click');
        expect(newRecipeInstance.state.tempSearchSettings.Dessert).toEqual(false); 
    });

    it(`should render search mode`, () => {
        let searchModeList = ['likes','rating','cost']
        const component = mount(recipeList);
        let newRecipeInstance = component.find(RecipeList.WrappedComponent).instance();

        let wrapper = component.find('.search-options-button');
        expect(wrapper.length).toBe(1);
        
        let wrapper2 = component.find('.search-mode-select-button');
        expect(wrapper2.length).toBe(3);
        for(let i=0;i<3;i++){
          wrapper2 = component.find('.search-mode-select-button')
          wrapper2.at(i).simulate('click');
          expect(newRecipeInstance.state.tempSearchSettings.searchMode).toEqual(searchModeList[i]);
          wrapper.simulate('click');
        }
        
        wrapper = component.find('.search-confirm-button');
        wrapper.simulate('click');
        //expect(component.state('search')).toBe(1);
    });

    
    
    
});