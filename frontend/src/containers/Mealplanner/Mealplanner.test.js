import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history' ;
import {getMockStore} from '../../test-utils/mocks.js'

import * as actionCreators from '../../store/actions/recipe';
import Mealplanner from './Mealplanner'

const stubState = {
  selectedRecipe: {
    'ingredient_list': [
      {'name': 'ingredient', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
      'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}],
    'photo_list': ['test_image'    ]
  }
}
const stubRecipeArray = [[{ id: 1, thumbnail: 0, real_id: 0 }, { id: 2, thumbnail: 0, real_id: 0}, { id: 3, thumbnail: 0, real_id: 0}],
[{ id: 4, thumbnail: 0, real_id: 0 }, { id: 5, thumbnail: 0, real_id: 0 }, { id: 6, thumbnail: 0, real_id: 0 }],
[{ id: 7, thumbnail: 0, real_id: 0 }, { id: 8, thumbnail: 0, real_id: 0 }, { id: 9, thumbnail: 0, real_id: 0 }]]


const history = createBrowserHistory()
const mockStore = getMockStore(stubState)

jest.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
  }, {}),
  Draggable: ({ children }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
  }, {}),
  DragDropContext: ({ children }) => children,
}));



describe('<Mealplanner />', () => {
  const fflushPromises = () => {
    return new Promise(resolve => setImmediate(resolve))
  }
    let mealplanner //, spyOnGetRecipe;
    beforeEach(() => {
      mealplanner = (
        <Provider store={mockStore}>
          <Router history={history}>
              <Mealplanner/>
          </Router>
        </Provider>
      );
      
    })
  
    it('should render Mealplanner', async() => {
      // let spyHistory = jest.spyOn(history, 'push')
      // .mockImplementation(() => {})

      let spyOnGetRecipe = jest.spyOn(actionCreators, 'getRecipes')
        .mockImplementation(() => {
        return () => new Promise((resolve) => {
          const result = {randomRecipe: stubRecipeArray}
          setImmediate(resolve(result))
        })
      })
      const component = mount(mealplanner);
      await fflushPromises();
      expect(spyOnGetRecipe).toHaveBeenCalledTimes(0)
      let wrapper = component.find('Mealplanner');
      expect(wrapper.length).toBe(1)
    });

    it('should test searchbar', () => {
      const component = mount(mealplanner)
      let wrapper = component.find('.Searchbar #min')
      wrapper.simulate('change', {target: {value: 'test'}})
      wrapper = component.find('.Searchbar #max')
      wrapper.simulate('change', {target: {value: 'test'}})
      wrapper = component.find('.Searchbar #numOfDays')
      wrapper.simulate('change', {target: {value: 'test'}})
      wrapper = component.find('.Searchbar button')
      wrapper.simulate('click')
    })

    it('should test day', () => {
      const component = mount(mealplanner)
      let wrapper = component.find('button')
      wrapper.forEach((button) => {
        button.simulate('click')
      })
    })

    it('should test scrappedRecipe', () => {
      let spyHistory = jest.spyOn(history, 'push')
      .mockImplementation(() => {})
      const component = mount(mealplanner)
      let wrapper = component.find('.scrappedRecipe img')
      // wrapper.forEach(image => {
      //   image.simulate('click')
      // })
      wrapper.at(0).simulate('click')
      expect(spyHistory).toHaveBeenCalledTimes(1)
      
    })

});