import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter} from 'connected-react-router';
import {BrowserRouter, Router,Route, Redirect, Switch} from 'react-router-dom';
import { createBrowserHistory } from 'history' ;
import DishStep from './DishStep';


describe('DishStep', () => {

    it('should render DishStep', () => {
        const component = shallow(<DishStep />);
        const wrapper = component.find('.dish_step');
        expect(wrapper.length).toBe(1)
    })
})