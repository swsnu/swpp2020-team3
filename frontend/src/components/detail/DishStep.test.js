import React from 'react';
import {shallow, mount} from 'enzyme';

import DishStep from './DishStep';

describe('<DishStep />', () => {
    let dishstep;

    beforeEach(() => {
        dishstep = (
            <DishStep img={'test_img'} explanation={'test_explanation'}/>
        )
    })

    it('should render DishStep', () => {
        const component = mount(dishstep);
        const wrapper = component.find('DishStep');
        expect(wrapper.length).toBe(1);
        expect(wrapper.find('img').prop("src")).toEqual('test_img');
        expect(wrapper.find('.dish_explanation').text()).toEqual('test_explanation')
    })
})