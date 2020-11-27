import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';

import MyPage from './MyPage';
import { getMockStore } from '../../test-utils/mocks';
import { history } from '../../store/store';
import * as actionCreators from '../../store/actions/userCreators';

jest.mock('../../components/Recipe/Recipe', () => {
  return jest.fn(props => {
    return (
      <div className="spyRecipe">
        <div className = 'title'>
          {props.title}
        </div>
        <button className = 'spyButton' onClick = {props.clickedRecipe} />
      </div>);
  });
});

jest.mock('../MyInfo/MyInfo', () => {
  return jest.fn(props => {
    return (
      <div className="spyMyInfo">
    </div>);
  });
});

jest.mock('../../components/UserInfo/SimpleUserInfo', () => {
  return jest.fn(props => {
    return (
      <div className="spySimpleUserInfo">
        <div className = 'username'>
          {props.username}
        </div>
      </div>);
  });
});



let recipe1 = {id: 1, author:'author'+1 , title:'title'+1, price: 'price'+1, rating: 'rating'+1, likes: 'likes'+1, thumbnail: ''};
let recipe2 = {id: 2, author:'author'+2 , title:'title'+1, price: 'price'+1, rating: 'rating'+1, likes: 'likes'+1, thumbnail: ''};
let recipe3 = {id: 3, author:'author'+3 , title:'title'+1, price: 'price'+1, rating: 'rating'+1, likes: 'likes'+1, thumbnail: ''};
let user2 = {
    id: 2,
    user_info: [{
        id: 2,
        username: 'author2',
        firstname: 'author',
        lastname: '2',
        email: 'author2@naver.com'
    }],
    liked_recipes: [recipe1],
    recipe_basket: [recipe3],
    written_recipes: [recipe2],
    follower: [],
    following: [],
}
let user3 = {
    id: 3,
    user_info: [{
        id: 2,
        username: 'author3',
        firstname: 'author',
        lastname: '3',
        email: 'author3@naver.com'
    }],
    liked_recipes: [recipe2],
    recipe_basket: [recipe1],
    written_recipes: [recipe3],
    follower: [],
    following: [],
}
let user1 = {
    id: 1,
    user_info: [{
        id: 2,
        username: 'author1',
        firstname: 'author',
        lastname: '1',
        email: 'author1@naver.com'
    }],
    liked_recipes: [recipe3,recipe2,recipe1],
    recipe_basket: [recipe2,recipe3],
    written_recipes: [recipe1],
    follower: [user2],
    following: [user3],
}

const stubInitialState = {
  getuser : user1,
};
const mockStore = getMockStore(stubInitialState);

describe('<MyPage />', () => {
    let myPage, spyGetUser;
    beforeEach(() => {  
        myPage = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                <Switch>
                    <Route path='/' component = {MyPage} />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
        spyGetUser = jest.spyOn(actionCreators, 'getUser')
        .mockImplementation(() => { return () => {}; });
    });

    afterEach(() => {
      jest.clearAllMocks();
    })

    it(`should set render properly on my profile tab`, () => {
        const component = mount(myPage);
        let wrapper = component.find('.my-profile-button');
        wrapper.simulate('click');
        let newRecipeInstance = component.find(MyPage.WrappedComponent).instance();
        expect(newRecipeInstance.state.tab).toEqual('my-profile');
        wrapper = component.find('#userdetail');
        wrapper.at(0).simulate('click');
        expect(newRecipeInstance.state.tab).toEqual('liked-recipes');

        wrapper = component.find('.my-profile-button');
        wrapper.simulate('click');
        wrapper = component.find('#userdetail');
        wrapper.at(1).simulate('click');
        expect(newRecipeInstance.state.tab).toEqual('recipe-basket');

        wrapper = component.find('.my-profile-button');
        wrapper.simulate('click');
        wrapper = component.find('#userdetail');
        wrapper.at(2).simulate('click');
        expect(newRecipeInstance.state.tab).toEqual('written-recipes');
    });
    it(`should set render properly on my info tab`, () => {
        const component = mount(myPage);
        let wrapper = component.find('.my-info-button');
        wrapper.simulate('click');
        let newRecipeInstance = component.find(MyPage.WrappedComponent).instance();
        expect(newRecipeInstance.state.tab).toEqual('my-info');
        wrapper = component.find('.spyMyInfo');
        expect(wrapper.length).toBe(1);
    });
    it(`should set render properly on liked recipes tab`, () => {
        const component = mount(myPage);
        let wrapper = component.find('.liked-recipes-button');
        wrapper.simulate('click');
        let newRecipeInstance = component.find(MyPage.WrappedComponent).instance();
        expect(newRecipeInstance.state.tab).toEqual('liked-recipes');
        wrapper = component.find('.spyRecipe');
        expect(wrapper.length).toBe(3);
    });
    it(`should set render properly on recipe basket tab`, () => {
        const component = mount(myPage);
        let wrapper = component.find('.recipe-basket-button');
        wrapper.simulate('click');
        let newRecipeInstance = component.find(MyPage.WrappedComponent).instance();
        expect(newRecipeInstance.state.tab).toEqual('recipe-basket');
        wrapper = component.find('.spyRecipe');
        expect(wrapper.length).toBe(2);
    });
    it(`should set render properly on written recipes tab`, () => {
        const component = mount(myPage);
        let wrapper = component.find('.written-recipes-button');
        wrapper.simulate('click');
        let newRecipeInstance = component.find(MyPage.WrappedComponent).instance();
        expect(newRecipeInstance.state.tab).toEqual('written-recipes');
        wrapper = component.find('.spyRecipe');
        expect(wrapper.length).toBe(1);
    });
    it(`should set render properly on follower tab`, () => {
        const component = mount(myPage);
        let wrapper = component.find('.follower-button');
        wrapper.simulate('click');
        let newRecipeInstance = component.find(MyPage.WrappedComponent).instance();
        expect(newRecipeInstance.state.tab).toEqual('follower');
        wrapper = component.find('.spySimpleUserInfo');
        expect(wrapper.length).toBe(1);
    });
    it(`should set render properly on following tab`, () => {
        const component = mount(myPage);
        let wrapper = component.find('.following-button');
        wrapper.simulate('click');
        let newRecipeInstance = component.find(MyPage.WrappedComponent).instance();
        expect(newRecipeInstance.state.tab).toEqual('following');
        wrapper = component.find('.spySimpleUserInfo');
        expect(wrapper.length).toBe(1);
    });

    it(`clickRecipeHandler should work`, () => {
        const spyHistoryPush = jest.spyOn(history, 'push')
        .mockImplementation(() => {});
        const component = mount(myPage);

        const wrapper = component.find('.spyButton');
        wrapper.at(0).simulate('click');
        expect(spyHistoryPush).toHaveBeenCalledTimes(1);
        wrapper.at(1).simulate('click');
        expect(spyHistoryPush).toHaveBeenCalledTimes(2);
        wrapper.at(2).simulate('click');
        expect(spyHistoryPush).toHaveBeenCalledTimes(3);
        wrapper.at(3).simulate('click');
        expect(spyHistoryPush).toHaveBeenCalledTimes(4);
        wrapper.at(4).simulate('click');
        expect(spyHistoryPush).toHaveBeenCalledTimes(5);
        wrapper.at(5).simulate('click');
        expect(spyHistoryPush).toHaveBeenCalledTimes(6);
    });
    
    
    
});