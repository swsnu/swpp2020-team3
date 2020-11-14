import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter} from 'connected-react-router';
import {BrowserRouter, Router,Route, Redirect, Switch} from 'react-router-dom';
import { createBrowserHistory } from 'history' ;

import Ingredient from './Ingredient';
import {getMockStore} from '../../test-utils/mocks.js'
import * as actionCreators from '../../store/actions/recipe';

const stubState = {
    ingredientList: [
        {'name': 'ingredient', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
        'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}
    ]
}

const mockHistory = createBrowserHistory()
const mockStore = getMockStore(stubState)

jest.mock("react-dropdown", () => ({  }) => {
    return (
      <div className='dropdown'>
          <h1>dropdown</h1>
      </div>
    );
  });

describe('Ingredient', () => {
    let ingredient, spyOnGetIgrList;
    beforeEach(() => {
        ingredient = (
            <Provider store={mockStore}>
              <Router history={mockHistory}>
                  <Ingredient />
              </Router>
            </Provider>
          );
        spyOnGetIgrList = jest.spyOn(actionCreators, 'getIngredients')
            .mockImplementation(() => {return dispatch => {}})
      })

    it('should render Ingredient', () => {
        const component = mount(ingredient)
        const wrapper = component.find('Ingredient')
        expect(wrapper.length).toBe(1)
    })

})