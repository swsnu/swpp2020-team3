import React from 'react';
import { shallow } from 'enzyme';
import DishResult from './DishResult';


describe('DishResult', () => {

    afterEach(() => {
        jest.clearAllMocks();
    })
    it('should render DishResult', () => {
        const component = shallow(<DishResult tag={['test_tag1', 'test_tag2']} />);
        const wrapper = component.find('.dish_result');
        expect(wrapper.length).toBe(1)
    })
    
    it('when category', () => {
        const component = shallow(<DishResult category={['test_c_1', 'test_c_2']} tag={['test_tag1', 'test_tag2']} />);
        const wrapper = component.find('.dish_result');
        expect(wrapper.length).toBe(1)
    })

    it('should not rencder when logout', () => {
        const component = shallow(<DishResult loginid={-1} tag={['test_tag1', 'test_tag2']} />);
        const wrapper = component.find('#ub');
        expect(wrapper.length).toBe(0)
    })

    it('should check like color', () => {
        const component = shallow(<DishResult loginid={1} tag={['test_tag1', 'test_tag2']} islike={true}/>);
        const wrapper = component.find('#ub').get(0)
        expect(wrapper.props.style).toHaveProperty('background-color', '#c2563a')
    })

    it('should check scrap color', () => {
        const component = shallow(<DishResult loginid={1} tag={['test_tag1', 'test_tag2']} isscrap={true}/>);
        const wrapper = component.find('#ub').get(1)
        expect(wrapper.props.style).toHaveProperty('background-color', '#c2563a')
    })

    it('should handleRating', () => {
        const component = shallow(<DishResult loginid={1} tag={['test_tag1', 'test_tag2']} isscrap={true}/>);
        const spyRating = jest.fn();
        component.instance().handleRating = spyRating;

        const wrapper = component.find('#userbuttons input');
        wrapper.simulate('change', )
        expect(spyRating).toHaveBeenCalledTimes(1);
    })

    it('test handleRating', () => {
        const spyUpdate = jest.fn();
        const component = shallow(<DishResult loginid={1} tag={['test_tag1', 'test_tag2']} isscrap={true} updateState={(arg) => spyUpdate()}/>);
        component.instance().handleRating({target: {value: 2}})
        expect(spyUpdate).toHaveBeenCalledTimes(1);
    })
})