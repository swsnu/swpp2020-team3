import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import RecipeList from './RecipeList';

jest.mock('../../components/Recipe/Recipe', () => {
  return jest.fn(props => {
    return (
      <div className="spyRecipe">
        <div className="title">
          {props.title}
        </div>
        <button className="likesButton" onClick={props.clickLikes} />
        <button className="detailButton" onClick={props.clickDetail} />
      </div>);
  });
});

describe('<RecipeList />', () => {

    it('should render Recipes', () => {
        const component = shallow(<RecipeList/>);
        const wrapper = component.find('.RecipeList');
        expect(wrapper.length).toBe(1);
    });

    it(`should set state properly on cost input`, () => {
        const minCost = 20, maxCost=100;
        const component = mount(<RecipeList/>);
        let wrapper = component.find('.min-cost-input');
        wrapper.simulate('change', { target: { value: minCost } });
        wrapper = component.find('.max-cost-input');
        wrapper.simulate('change', { target: { value: maxCost } });
        expect(component.state("minCost")).toEqual(20);
        expect(component.state("maxCost")).toEqual(100);
    });

    it(`should set state properly on time input`, () => {
        const minTime = 20, maxTime=100;
        const component = mount(<RecipeList/>);
        let wrapper = component.find('.min-time-input');
        wrapper.simulate('change', { target: { value: minTime } });
        wrapper = component.find('.max-time-input');
        wrapper.simulate('change', { target: { value: maxTime } });
        expect(component.state("minTime")).toEqual(20);
        expect(component.state("maxTime")).toEqual(100);
    });

    it(`should render categories`, () => {
        const component = mount(<RecipeList />);
        
        let wrapper = component.find('.category-select-button');
        expect(wrapper.length).toBe(6);
        wrapper.at(0).simulate('click');
        expect(component.state('categories')[0]).toEqual(true);
        wrapper.at(1).simulate('click');
        expect(component.state('categories')[1]).toEqual(true);
        wrapper.at(2).simulate('click');
        expect(component.state('categories')[2]).toEqual(true);
        wrapper.at(3).simulate('click');
        expect(component.state('categories')[3]).toEqual(true);
        wrapper.at(4).simulate('click');
        expect(component.state('categories')[4]).toEqual(true);
        wrapper.at(5).simulate('click');
        expect(component.state('categories')[5]).toEqual(true);
        
    });

    it(`should render search mode`, () => {
        const component = mount(<RecipeList />);
        
        let wrapper = component.find('.search-options-button');
        wrapper.simulate('click');
        expect(component.state('searchOptionsClicked')).toBe(true);

        wrapper = component.find('.search-mode-select-button');
        expect(wrapper.length).toBe(3);
        wrapper.at(0).simulate('click');
        expect(component.state('searchMode')).toEqual("relevance");
        wrapper.at(1).simulate('click');
        expect(component.state('searchMode')).toEqual("most-liked");
        wrapper.at(2).simulate('click');
        expect(component.state('searchMode')).toEqual("most-recent");
        

        wrapper = component.find('.search-confirm-button');
        wrapper.simulate('click');
        expect(component.state('search')).toBe(1);
    });

    it(`should render pages`, () => {
        const component = mount(<RecipeList />);
        
        let wrapper = component.find('.list-page-next-button');
        expect(wrapper.length).toBe(1);
        expect(component.state('pageStart')).toBe(0);
        wrapper.simulate('click');
        expect(component.state('pageStart')).toBe(5);

        wrapper = component.find('.list-page-number-button');
        expect(wrapper.length).toBe(5);
        wrapper.at(0).simulate('click');
        expect(component.state('currentPage')).toBe(6);
        wrapper.at(1).simulate('click');
        expect(component.state('currentPage')).toBe(7);
        wrapper.at(2).simulate('click');
        expect(component.state('currentPage')).toBe(8);
        wrapper.at(3).simulate('click');
        expect(component.state('currentPage')).toBe(9);
        wrapper.at(4).simulate('click');
        expect(component.state('currentPage')).toBe(10);

        wrapper = component.find('.list-page-previous-button');
        expect(wrapper.length).toBe(1);
        expect(component.state('pageStart')).toBe(5);
        wrapper.simulate('click');
        expect(component.state('pageStart')).toBe(0);
    });
});