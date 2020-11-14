import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter} from 'connected-react-router';
import {BrowserRouter, Router,Route, Redirect, Switch} from 'react-router-dom';
import { createBrowserHistory } from 'history' ;
import DishResult from './DishResult';


describe('DishResult', () => {

    it('should render DishResult', () => {
        const component = shallow(<DishResult tag={['test_tag1', 'test_tag2']} />);
        const wrapper = component.find('.dish_result');
        expect(wrapper.length).toBe(1)
    })
})