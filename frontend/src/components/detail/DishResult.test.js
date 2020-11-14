import React from 'react';
import { shallow } from 'enzyme';
import DishResult from './DishResult';


describe('DishResult', () => {

    it('should render DishResult', () => {
        const component = shallow(<DishResult tag={['test_tag1', 'test_tag2']} />);
        const wrapper = component.find('.dish_result');
        expect(wrapper.length).toBe(1)
    })
})