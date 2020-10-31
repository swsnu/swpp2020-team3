import React from 'react';
import { shallow } from 'enzyme';
import Recipe from './Recipe';

describe('<Recipe />', () => {
  it('should render without errors', () => {
    const component = shallow(<Recipe />);
    const wrapper = component.find(".Recipe");
    expect(wrapper.length).toBe(1);
  });

  it('should render author of the recipe', () => {
    const component = shallow(<Recipe author={'TEST_AUTHOR'} />);
    const wrapper = component.find('.recipe_author');
    expect(wrapper.text()).toEqual('TEST_AUTHOR');
  });

  it('should render abstraction of the recipe', () => {
    const component = shallow(<Recipe abstraction= {'TEST_ABSTRACTION'} />);
    const wrapper = component.find('.recipe_abstraction');
    expect(wrapper.text()).toEqual('TEST_ABSTRACTION');
  });

  it('should render title of the recipe', () => {
    const component = shallow(<Recipe title={'TEST_TITLE'} />);
    const wrapper = component.find('.recipe_title');
    expect(wrapper.text()).toEqual('TEST_TITLE');
  });

  it('should render rating of the recipe', () => {
    const component = shallow(<Recipe rating={'TEST_TITLE'} />);
    const wrapper = component.find('.recipe_rating');
    expect(wrapper.text()).toEqual('TEST_TITLE');
  });

  it('should render time of the recipe', () => {
    const component = shallow(<Recipe time={30} />);
    const wrapper = component.find('.recipe_time');
    expect(wrapper.text()).toEqual('30');
  });

  it('should render cost of the recipe', () => {
    const component = shallow(<Recipe cost={4000} />);
    const wrapper = component.find('.recipe_cost');
    expect(wrapper.text()).toEqual('4000');
  });

  it('should handle clickRecipe', () => {
    const mockClickDone = jest.fn();
    const component = shallow(<Recipe clickedRecipe={mockClickDone} />);
    const wrapper = component.find('.recipe-detail-button');
    wrapper.simulate('click');
    expect(mockClickDone).toHaveBeenCalledTimes(1);
  });

  it('should handle clickLikes', () => {
    const mockClickDone = jest.fn();
    const component = shallow(<Recipe likes={20} clickedLikes={mockClickDone} />);
    const wrapper = component.find('.recipe_likes');
    expect(wrapper.text()).toEqual('20');
    wrapper.simulate('click');
    expect(mockClickDone).toHaveBeenCalledTimes(1);
  });
});