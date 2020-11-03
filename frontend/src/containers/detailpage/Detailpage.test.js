import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import {BrowserRouter, Router, Route, Redirect, Switch} from 'react-router-dom';
import { createBrowserHistory } from 'history' ;

import Detailpage from './Detailpage'

const history = createBrowserHistory()


describe('<Detailpage />', () => {
    let detailpage;

    beforeEach(() => {
      detailpage = (
        <Router history={history}>
            <Detailpage history={history}/>
        </Router>
      );
    })
  
    it('should render Createpage', () => {
      const component = mount(detailpage);
      const wrapper = component.find('Detailpage');
      expect(wrapper.length).toBe(1)
    });
});