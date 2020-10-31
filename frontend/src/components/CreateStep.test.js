import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import {BrowserRouter, Router, Route, Redirect, Switch} from 'react-router-dom';
import { createBrowserHistory } from 'history' ;

import CreateStep from './CreateStep'

const history = createBrowserHistory()

// jest.mock('./ImageUploader', () => {
//     return jest.fn(() => {
//         return (
//             <div className="CreateStep">
//                 <h1>CreateStep</h1>
//             </div>
//         )
//     })
// })

describe('<CreateStep />', () => {
    let createstep;

    beforeEach(() => {
      createstep = (
        <Router history={history}>
            <CreateStep history={history}/>
        </Router>
      );
    })
  
    it('should render CreateStep', () => {
      const component = mount(createstep);
      const wrapper = component.find('CreateStep');
      expect(wrapper.length).toBe(1)
    });

    it('should test ImageUpload', () => {
        const component = mount(createstep);
        const wrapper = component.find('#ImageUploader');
        expect(wrapper.length).toBe(1)
        wrapper.simulate('change', { target: { picture: ['dummy'] }})
      });
})
       