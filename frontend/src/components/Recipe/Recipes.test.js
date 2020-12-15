import React from 'react';
import { shallow, mount } from 'enzyme';
import Recipes from './Recipes';

let recipePage=[];
for(let i=1;i<=60;i++){
  recipePage.push(<div className="spyRecipe"/>)
}

describe('<Recipes />', () => {
  it('should render without errors', () => {
    const component = shallow(<Recipes recipes={recipePage} />);
    const wrapper = component.find(".Recipes");
    expect(wrapper.length).toBe(1);
  });

  it('should render recipes', () => {
    const component = shallow(<Recipes recipes={recipePage} />);
    const wrapper = component.find('.spyRecipe');
    expect(wrapper.length).toBe(10);
  });

  it('should change pages', () => {
    const component = shallow(<Recipes recipes={recipePage} />);
    const componentInstance = component.instance();
    let wrapper = component.find('.spyRecipe');
    expect(wrapper.length).toBe(10);
      wrapper = component.find('.list-page-number-button');
      expect(wrapper.length).toBe(5);
      wrapper.at(0).simulate('click');
      expect(componentInstance.state.pageNumber).toEqual(1);
      //expect(wrapper.at(0).props('style')).toHaveProperty('',{"backgroundColor": "grey"});
      wrapper.at(1).simulate('click');
      expect(componentInstance.state.pageNumber).toEqual(2);
      //expect(wrapper.at(1).props('style')).toHaveProperty('backgroundColor','grey');
      wrapper.at(2).simulate('click');
      expect(componentInstance.state.pageNumber).toEqual(3);
      //expect(wrapper.at(2).props('style')).toHaveProperty('backgroundColor','grey');
      wrapper.at(3).simulate('click');
      expect(componentInstance.state.pageNumber).toEqual(4);
      //expect(wrapper.at(3).props('style')).toHaveProperty('backgroundColor','grey');
      wrapper.at(4).simulate('click');
      expect(componentInstance.state.pageNumber).toEqual(5);
      //expect(wrapper.at(4).props('style')).toHaveProperty('backgroundColor','grey');

      wrapper = component.find('.list-page-next-button');
      wrapper.simulate('click');
      expect(componentInstance.state.pageNumber).toEqual(6);

      wrapper = component.find('.list-page-previous-button');
      wrapper.simulate('click');
      expect(componentInstance.state.pageNumber).toEqual(1);
  });
});