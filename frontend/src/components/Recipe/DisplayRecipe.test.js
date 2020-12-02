import React from 'react';
import { shallow } from 'enzyme';
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