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
    const fflushPromises = () => {
        return new Promise(resolve => setImmediate(resolve));
    }
    let isLogin = jest.spyOn(actionCreators,'isLogin')
        .mockImplementation(() => {
            return () => new Promise(resolve => {
                const result = {login_id: 1}
                setImmediate(resolve(result))
            })
        })
    const spyAlert = jest.spyOn(window, 'alert')
    beforeEach(() => {
        signup = (
            <Provider store={mockStore}>
                <Router history={history}>
                    <Signup/>
                </Router>
            </Provider>
        );
        spyOnSignup = jest.spyOn(actionCreators, 'signUp')
        .mockImplementation(() => {
            return () => new Promise((resolve) => {
                const result = {user: [{'id': 1}]}
                setImmediate(resolve(result))
            })
        })
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

    it('should test submit', async () => {
        const component = mount(signup);
        const instance = component.find(Signup.WrappedComponent).instance();
        const spyClick = jest.fn();
        instance.onClickSubmit = spyClick;
        let wrapper = component.find('.SignupButton')
        wrapper.simulate('click')
        fflushPromises();
        expect(spyClick).toHaveBeenCalledTimes(1)
    })

    it('test onClickSubmit', () => {
        const component = mount(signup);
        const instance = component.find(Signup.WrappedComponent).instance();
        instance.setState({password:"password"})
        instance.onClickSubmit();
        expect(spyAlert).toHaveBeenCalledTimes(1);
        jest.clearAllMocks();
        instance.setState({password_confirm:"password"})
        instance.onClickSubmit();
        expect(spyAlert).toHaveBeenCalledTimes(1);
        jest.clearAllMocks();
        instance.setState({email: 'superkgd@gmail.com'})
        instance.onClickSubmit();
    })

    it('testing signup error', async () => {
        spyOnSignup = jest.spyOn(actionCreators, 'signUp')
        .mockImplementation(() => {
            return () => new Promise((resolve) => {
                const result = false;
                setImmediate(resolve(result))
            })
        })
        const component = mount(signup);
        const instance = component.find(Signup.WrappedComponent).instance();
        instance.setState({password:"password", password_confirm:"password", email: 'superkgd@gmail.com'})
        instance.onClickSubmit();
    })

    it('testing islogin', async () => {
        let spyPush = jest.spyOn(history, 'push');
        const component = mount(signup);
        await fflushPromises();
        expect(spyPush).toHaveBeenCalledTimes(1);
    })

    it('testing neg islogin', async () => {
        isLogin = jest.spyOn(actionCreators,'isLogin')
            .mockImplementation(() => {
                return () => new Promise(resolve => {
                    const result = {login_id: null}
                    setImmediate(resolve(result))
                })
            })
        const component = mount(signup);
        fflushPromises();
    })
    
    

})