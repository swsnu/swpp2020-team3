import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history' ;
import {getMockStore} from '../../test-utils/mocks.js'
import * as actionCreators from '../../store/actions/recipe';

import Detailpage from './Detailpage'

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

jest.mock('../../components/detail/DishResult', () => {
  return jest.fn(() => {
      return (
          <div className="DishResult">
              <h1>DishResult</h1>
          </div>
      )
  })
})
jest.mock('../../components/detail/DishStep', () => {
  return jest.fn(() => {
      return (
          <div className="DishStep">
              <h1>DishStep</h1>
          </div>
      )
  })
})
jest.mock('../comments/Comments', () => {
  return jest.fn(() => {
      return (
          <div className="Comments">
              <h1>Comments</h1>
          </div>
      )
  })
})
describe('<Detailpage />', () => {
    let detailpage, spyDeleteRecipe;
    beforeEach(() => {
      detailpage = (
        <Provider store={mockStore}>
          <Router history={history}>
              <Detailpage/>
          </Router>
        </Provider>
      );
      spyDeleteRecipe = jest.spyOn(actionCreators, 'deleteRecipe')
      .mockImplementation(() => {return () => {}})
    })
  
    it('should render Createpage', () => {
      const component = mount(detailpage);
      const wrapper = component.find('Detailpage');
      expect(wrapper.length).toBe(1)
    });

    it('should delete recipe', () => {
      const component = mount(detailpage);
      const wrapper = component.find('#delete-button');
      wrapper.simulate('click')
      expect(spyDeleteRecipe).toHaveBeenCalledTimes(1)
    })


});