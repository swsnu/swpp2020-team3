import { mount, shallow } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import Mainpage from './Mainpage'
import { createBrowserHistory } from 'history' ;
import {getMockStore} from '../../test-utils/mocks.js'
import * as recipeCreators from '../../store/actions/recipe';
import * as userCreators from '../../store/actions/userCreators';

const stubState = {
  ingredientList: [
      {'name': 'ingredient', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
      'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}
  ],
  login_id : 1,
  user: {
      login_id: 1
  }
}


const mockHistory = createBrowserHistory()
const mockStore = getMockStore(stubState)


describe('<Mainpage />', () => {
  let mainpage;
  const fflushPromises = () => {
    return new Promise(resolve => setImmediate(resolve));
  }
  beforeEach(() => {
    mainpage = (
        <Provider store={mockStore}>
          <Router history={mockHistory}>
              <Mainpage />
          </Router>
        </Provider>
      );

  })


  it('should render Mainpage', () => {
    let mockGetRandom = jest.spyOn(recipeCreators, 'getRandom')
        .mockImplementation(() => {
          return () => {};
        })
    let mockGetHot = jest.spyOn(recipeCreators, 'getHot')
    .mockImplementation(() => {
      return () => {};
    })
    let mockIsLogin = jest.spyOn(userCreators, 'isLogin')
      .mockImplementation(() => {
        return () => new Promise((resolve) => {
          const result = {login_id: 1}
          setImmediate(resolve(result))
        })
      })
    let mockgetMls = jest.spyOn(recipeCreators, 'getMl')
    .mockImplementation(() => {
      return () => new Promise((resolve) => {
        const result = {login_id: 1}
        setImmediate(resolve(result))
      })
    })


      const component = mount(mainpage);
      let wrapper = component.find('.Mainpage');
      expect(wrapper.length).toBe(1);

      wrapper = component.find('img');
      expect(wrapper.length).toBe(1);
      wrapper.simulate('click')
      let instance = component.find(Mainpage.WrappedComponent).instance()
      expect(instance.state.check).toBe(1)
  })

})