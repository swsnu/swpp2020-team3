import React from 'react';
import {shallow, mount} from 'enzyme';

import DishResult from './DishResult';

describe('<DishResult/>', () => {
    let dishresult;

    beforeEach(() => {
        dishresult = (
            <DishResult tag={['test_tag']}/>
        )
    })

    it('should render DishResult', () => {
        const component = mount(dishresult);
        const wrapper = component.find('DishResult');
        expect(wrapper.length).toBe(1);
        const tags = wrapper.find('#tag');
        expect(tags.length).toBe(1);
    })
})