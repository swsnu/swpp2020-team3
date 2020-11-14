import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history' ;

import Ingredient from './Ingredient';
import {getMockStore} from '../../test-utils/mocks.js'

const stubState = {
    ingredientList: [
        {'name': 'ingredient', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
        'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}
    ]
}

const mockHistory = createBrowserHistory()
const mockStore = getMockStore(stubState)

//put parantheses
jest.mock("react-dropdown", () => {() => {
    return (
      <div className='dropdown'>
          <h1>dropdown</h1>
      </div>
    );}
  });

describe('Ingredient', () => {
    let ingredient;
    beforeEach(() => {
        ingredient = (
            <Provider store={mockStore}>
              <Router history={mockHistory}>
                  <Ingredient />
              </Router>
            </Provider>
          );
      })

    it('should render Ingredient', () => {
        const component = mount(ingredient)
        const wrapper = component.find('Ingredient')
        expect(wrapper.length).toBe(1)
    })

})