import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter} from 'connected-react-router';
import {BrowserRouter, Router,Route, Redirect, Switch} from 'react-router-dom';
import { createBrowserHistory } from 'history' ;
import DisplayRecipe from './DisplayRecipe';

const history = createBrowserHistory()

describe('DisplayRecipe', () => {

    it('should render DisplayRecipe', () => {
        const component = shallow(<DisplayRecipe history={history}/>);
        const wrapper = component.find('#DRImage');
        wrapper.simulate('click')
        expect(wrapper.length).toBe(1)
    })
})