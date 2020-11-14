import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history' ;

import {getMockStore} from '../../../test-utils/mocks.js'
import * as actionCreators from '../../../store/actions/userCreators';
import Signup from './Signup';

const stubState = {
    ingredientList: [
        {'name': 'ingredient', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
        'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}
    ]
}

const history = createBrowserHistory()
const mockStore = getMockStore(stubState)

describe('Signup', () => {
    let signup, spyOnSignup;
    beforeEach(() => {
        signup = (
            <Provider store={mockStore}>
                <Router history={history}>
                    <Signup/>
                </Router>
            </Provider>
        );
        spyOnSignup = jest.spyOn(actionCreators, 'signUp')
        .mockImplementation(() => {return () => {}})
    });

    it('should render Signup', () => {
        const component = mount(signup);
        const wrapper = component.find('Signup');
        expect(wrapper.length).toBe(1)
    })

    it('should test input', () => {
        const component = mount(signup);
        let instance = component.find(Signup.WrappedComponent).instance()

        component.find('input').forEach((wrap) => {
            //wrap.simulate('change', {target: {value: wrap.find('name')}})
            let testVal = wrap.props()['name']
            wrap.simulate('change', {target: {value: `test_${testVal}`}})
            expect(instance.state[testVal]).toBe(`test_${testVal}`)
        })
    })

    it('should test submit', () => {
        const component = mount(signup);
        let wrapper = component.find('.SignupButton')
        wrapper.simulate('click')
        expect(spyOnSignup).toHaveBeenCalledTimes(1)
    })
    
    

})