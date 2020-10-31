import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import {BrowserRouter, Router, Route, Redirect, Switch} from 'react-router-dom';
import { createBrowserHistory } from 'history' ;

import Createpage from './Createpage'
import CreateStep from '../../components/CreateStep'

const history = createBrowserHistory()

jest.mock('../../components/CreateStep', () => {
    return jest.fn(() => {
        return (
            <div className="CreateStep">
                <h1>CreateStep</h1>
            </div>
        )
    })
})

describe('<Createpage />', () => {
    let createpage;

    beforeEach(() => {
      createpage = (
        <Router history={history}>
            <Createpage history={history}/>
        </Router>
      );
    })
  
    it('should render Createpage', () => {
      const component = mount(createpage);
      const wrapper = component.find('Createpage');
      expect(wrapper.length).toBe(1)
    });

   it('should add the types', () => {
       const component = mount(createpage)
       //Check adding the types
       for(var i=0; i<6; i++){
        const wrapper = component.find('#type').at(i)
        wrapper.simulate('click')
        const instance = component.find(Createpage.WrappedComponent).instance()
        expect(instance.state.typeList.length).toBe(i+1)
       }
       //Check removing the types
       for(var i=0; i<6; i++){
        const wrapper = component.find('#type').at(i)
        wrapper.simulate('click')
        const instance = component.find(Createpage.WrappedComponent).instance()
        expect(instance.state.typeList.length).toBe(5-i)
       }
    });

    it('should redirect', () => {
        var spyHistory = jest.spyOn(history, 'push')
            .mockImplementation(() => {})
        const component = mount(createpage)
        const wrapper = component.find('#submit')
        wrapper.simulate('click')
        expect(spyHistory).toHaveBeenCalledTimes(1)
    })

    it('should add new CreateStep to list', () => {
        const component = mount(createpage)
        const wrapper = component.find('#addStep')
        wrapper.simulate('click')
        const instance = component.find(Createpage.WrappedComponent).instance()
        expect(instance.state.CreateStepList.length).toBe(1)
    })
})
       