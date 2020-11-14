import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history' ;

import CreateStep from './CreateStep'
import {getMockStore} from '../../test-utils/mocks.js'

const stubState = {
    ingredientList: [
        {'name': 'ingredient', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
        'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}
    ]
}

const history = createBrowserHistory()
const mockStore = getMockStore(stubState)

describe('CreateStep', () => {
    let createstep;
    let inputHandler = jest.fn()
    let imageHandler = jest.fn()
    beforeEach(() => {
        createstep = (
            <Provider store={mockStore}>
              <Router history={history}>
                  <CreateStep event_text={inputHandler} event_image={imageHandler}/>
              </Router>
            </Provider>
          );
      })

    it('should render properly', () => {
        let component = mount(createstep)
        const wrapper = component.find('.step');
        expect(wrapper.length).toBe(1)
    })

    it('should test text change', () => {
        
        let component = mount(createstep)
        const wrapper = component.find('textarea')
        wrapper.simulate('change', {target: {value: 'test_value'}})
    })

    it('should test image change', () => {
       
        let component = mount(createstep)
        const wrapper = component.find('input')
        wrapper.simulate('change', {target: {files: ['test_value']}})
    })
})