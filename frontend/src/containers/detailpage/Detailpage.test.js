import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history' ;
import {getMockStore} from '../../test-utils/mocks.js'
import * as actionCreators from '../../store/actions/recipe';
import * as userCreators from '../../store/actions/userCreators';

import Detailpage from './Detailpage'

const stubState = {
  selectedRecipe: {
    'author': 1,
    'ingredient_list': [
      {'name': 'ingredient', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
      'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}],
    'photo_list': ['test_image'],
    'liked_user': [1, 2],
    'scrapped_user': [1, 3]
  }
}

const history = createBrowserHistory()
const mockStore = getMockStore(stubState)

jest.mock('../../components/detail/DishResult', () => {
  return jest.fn(() => {
      return (
          <div className="spyDishResult">
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
    let spyIsLogin = jest.spyOn(userCreators, 'isLogin')
      .mockImplementation(() => {
          return () => new Promise((resolve) => {
              const result = {login_id: 1}
              setImmediate(resolve(result))
          })
      })
    const fflushPromises = () => {
      return new Promise(resolve => setImmediate(resolve));
    }
    const spyGetRecipe = jest.spyOn(actionCreators, 'getRecipe')
      .mockImplementation(() => {
        return () => {}
      })
    beforeEach(() => {
      detailpage = (
        <Provider store={mockStore}>
          <Router history={history}>
              <Detailpage match={{params:{id:1}}}/>
          </Router>
        </Provider>
      );
      spyDeleteRecipe = jest.spyOn(actionCreators, 'deleteRecipe')
      .mockImplementation(() => {return () => {}})
    })

    afterEach(() => {
      jest.clearAllMocks();
    })
  
    it('should render Detailpage', () => {
      const component = mount(detailpage);
      const wrapper = component.find('Detailpage');
      expect(wrapper.length).toBe(1)
    });

    it('should delete recipe', async () => {
      let component = mount(detailpage);
      await fflushPromises();
      component.update();
      const wrapper = component.find('#delete-button');
      expect(spyIsLogin).toHaveBeenCalledTimes(1);
      console.log(component.debug())
      wrapper.simulate('click')
      expect(spyDeleteRecipe).toHaveBeenCalledTimes(1)
    })
});