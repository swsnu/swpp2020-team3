import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history' ;
import {getMockStore} from '../../test-utils/mocks.js'
import * as actionCreators from '../../store/actions/recipe';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Mealplanner from './Mealplanner'

const stubState = {
  selectedRecipe: {
    'ingredient_list': [
      {'name': 'ingredient', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
      'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}],
    'photo_list': ['test_image'    ]
  }
}

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
    let mealplanner;
    beforeEach(() => {
      mealplanner = (
        <Provider store={mockStore}>
          <Router history={history}>
              <Mealplanner/>
          </Router>
        </Provider>
      );
      
    })
  
    it('should render Mealplanner', () => {
      const component = mount(mealplanner);
      const wrapper = component.find('Mealplanner');
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

});