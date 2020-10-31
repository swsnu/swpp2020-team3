import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import {BrowserRouter, Router, Route, Redirect, Switch} from 'react-router-dom';
import { createBrowserHistory } from 'history' ;

import Createpage from './Createpage'
import CreateStep from './CreateStep'

const history = createBrowserHistory()

describe('<CreateStep />', () => {
    let createstep;

    beforeEach(() => {
      createstep = (
        <Router history={history}>
            <CreateStep history={history}/>
        </Router>
      );
    })
  
    it('should render Createpage', () => {
      const component = mount(createpage);
      const wrapper = component.find('Createpage');
      expect(wrapper.length).toBe(1)
    });
})
       