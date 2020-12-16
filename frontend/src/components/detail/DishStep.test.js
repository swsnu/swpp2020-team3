import React from 'react';
import { shallow } from 'enzyme';
import DishStep from './DishStep';


describe('DishStep', () => {

    it('should render DishStep', () => {
        const component = shallow(<DishStep />);
        const wrapper = component.find('.dish_step');
        expect(wrapper.length).toBe(1)
    })
})