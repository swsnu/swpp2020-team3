import React from 'react';
import { mount } from 'enzyme';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history' ;
import { getMockStore } from '../../test-utils/mocks';

import Navbar from './Navbar'

const history = createBrowserHistory()

const stubInitialState = {
  user : {login_id: 'hello'}
};
const mockStore = getMockStore(stubInitialState);

describe('<Navbar />', () => {
    let navBar;
  
    beforeEach(() => {
      navBar = (
        <Provider store={mockStore}>
          <Router history={history}>
              <Navbar history={history}/>
          </Router>
        </Provider>
      );
      delete window.location;
      window.location = { reload: jest.fn() };
    })
  
    it('should render Navbar', () => {
      const component = mount(navBar);
      const wrapper = component.find('.BackNavBar');
      expect(wrapper.length).toBe(1);
    });

    it('should render input', () => {
        const component = mount(navBar);
        const min = 0;
        let wrapper = component.find('input').at(0);
        wrapper.simulate('click')
        wrapper.simulate('change', { target: { value: min } });
        wrapper.simulate('click')
        expect(wrapper.length).toBe(1);
        
        const max = 0;
        wrapper = component.find('input').at(1);
        wrapper.simulate('click')
        wrapper.simulate('change', { target: { value: max } });
        wrapper.simulate('click')
        expect(wrapper.length).toBe(1);

        const keyword = 0;
        wrapper = component.find('input').at(2);
        wrapper.simulate('click')
        wrapper.simulate('change', { target: { value: keyword } });
        wrapper.simulate('click')
        expect(wrapper.length).toBe(1);

        wrapper = component.find('.Search_Confirm').at(0);
        wrapper.simulate('click')
        expect(wrapper.length).toBe(1);
        // must return message
        let instance = component.find(Navbar.WrappedComponent).instance()
        instance.setState({maxPrice: 'as', minPrice: 'as'})
        wrapper.simulate('click')
        expect(wrapper.length).toBe(1);
      });

    it('should test categories', () => {
      const component = mount(navBar);
      component.find('a').forEach((wrap) => {
        let instance = component.find(Navbar.WrappedComponent).instance()
        instance.setState({maxPrice: '12', minPrice: '15'})
        wrap.simulate('click')
      })
    })


})