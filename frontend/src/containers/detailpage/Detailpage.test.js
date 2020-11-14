import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import {BrowserRouter, Router, Route, Redirect, Switch} from 'react-router-dom';
import { createBrowserHistory } from 'history' ;
import {getMockStore} from '../../test-utils/mocks.js'
import * as actionCreators from '../../store/actions/recipe';

import Detailpage from './Detailpage'
import DishResult from '../../components/detail/DishResult';
import DishStep from '../../components/detail/DishStep';
import Comments from '../comments/Comments';

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
  return jest.fn((props) => {
      return (
          <div className="DishResult">
              <h1>DishResult</h1>
          </div>
      )
  })
})
jest.mock('../../components/detail/DishStep', () => {
  return jest.fn((props) => {
      return (
          <div className="DishStep">
              <h1>DishStep</h1>
          </div>
      )
  })
})
jest.mock('../comments/Comments', () => {
  return jest.fn((props) => {
      return (
          <div className="Comments">
              <h1>Comments</h1>
          </div>
      )
  })
})
describe('<Detailpage />', () => {
  const stub = {'name': 'test_name', 'brand': 'test_branch', 'quantity': 'test_quantity', 'price': 'test_price', 'igd_type': 'test_type'}
    let detailpage, spyGetRecipe, spyDeleteRecipe;
    beforeEach(() => {
      detailpage = (
        <Provider store={mockStore}>
          <Router history={history}>
              <Detailpage/>
          </Router>
        </Provider>
      );
      spyGetRecipe = jest.spyOn(actionCreators, 'getRecipe')
      .mockImplementation((id) => {return dispatch => {}})
      spyDeleteRecipe = jest.spyOn(actionCreators, 'deleteRecipe')
      .mockImplementation(() => {return dispatch => {}})
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