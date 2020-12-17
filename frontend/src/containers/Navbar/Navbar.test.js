import React from 'react';
import { mount } from 'enzyme';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history' ;
import { getMockStore } from '../../test-utils/mocks';

import Navbar from './Navbar';
import * as userCreators from '../../store/actions/userCreators';

const history = createBrowserHistory()

let stubInitialState = {
  login_id: 0
};
let mockStore = getMockStore(stubInitialState);

describe('<Navbar />', () => {
    let navBar;
  
    const fflushPromises = () => {
      return new Promise(resolve => setImmediate(resolve))
    }
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

    it('should test categories withdout price', () => {
      const component = mount(navBar);
      component.find('a').forEach((wrap) => {
        let instance = component.find(Navbar.WrappedComponent).instance()
        instance.setState({maxPrice: '', minPrice: ''})
        wrap.simulate('click')
      })
    })

    it('should test categories with error', () => {
      const component = mount(navBar);
      component.find('a').forEach((wrap) => {
        let instance = component.find(Navbar.WrappedComponent).instance()
        instance.setState({maxPrice: 'a', minPrice: 'b'})
        wrap.simulate('click')
      })
    })
    
    it('should logout', async () => {
      const spyLogout = jest.spyOn(userCreators, 'signOut')
        .mockImplementation(() => {
          return () => new Promise((resolve) => {
            setImmediate(resolve({}))
          })
        })
      stubInitialState = {
        login_id: 1
      };
      mockStore = getMockStore(stubInitialState);
      navBar = (
        <Provider store={mockStore}>
          <Router history={history}>
              <Navbar history={history}/>
          </Router>
        </Provider>
      );

      const component = mount(navBar);
      const wrapper = component.find('#lilogout');
      wrapper.simulate('click');
      await fflushPromises();
      expect(spyLogout).toHaveBeenCalledTimes(1);
    })

})