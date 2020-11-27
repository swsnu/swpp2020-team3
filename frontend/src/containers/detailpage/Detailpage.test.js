import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history' ;
import {getMockStore} from '../../test-utils/mocks.js'
import * as recipeCreators from '../../store/actions/recipe';
import * as userCreators from '../../store/actions/userCreators';

import Detailpage from './Detailpage'
import DishStep from '../../components/detail/DishStep.js';
import DishResult from '../../components/detail/DishResult.js';

const stubState = {
  selectedRecipe: {
    'author': 1,
    'ingredient_list': [
      {'name': 'ingredient', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
      'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}],
    'photo_list': ['test_image'],
    'liked_user': [1, 2],
    'scrapped_user': [1, 3],
    'description_list': ['des_1', 'des_2'],
    'thumbnail': 'a'
  }
}

const history = createBrowserHistory()
let mockStore = getMockStore(stubState)

jest.mock('../../components/detail/DishResult', () => {
  return jest.fn((props) => {
      return (
          <div className="spyDishResult">
              <h1>DishResult</h1>
              <button onClick={() => props.onlikeClicked()} id="spylike">Like</button>
              <button onClick={() => props.onscrapClicked()} id="spyscrap">Scrap</button>
          </div>
      )
  })
})
jest.mock('../../components/detail/DishStep', () => {
  return jest.fn(() => {
      return (
          <div className="DishStep">
              <h1>DishStep</h1>
          </div>
      )
  })
})
jest.mock('../comments/Comments', () => {
  return jest.fn(() => {
      return (
          <div className="Comments">
              <h1>Comments</h1>
          </div>
      )
  })
})
describe('<Detailpage />', () => {
    let detailpage, spyDeleteRecipe;
    let spyIsLogin = jest.spyOn(userCreators, 'isLogin')
      .mockImplementation(() => {
          return () => new Promise((resolve) => {
              const result = {login_id: 1}
              setImmediate(resolve(result))
          })
      })
    const fflushPromises = () => {
      return new Promise(resolve => setImmediate(resolve));
    }
    const spyGetRecipe = jest.spyOn(recipeCreators, 'getRecipe')
      .mockImplementation((id) => {
        return dispatch => {}
      })
    beforeEach(() => {
      detailpage = (
        <Provider store={mockStore}>
          <Router history={history}>
              <Detailpage match={{params:{id:1}}}/>
          </Router>
        </Provider>
      );
      spyDeleteRecipe = jest.spyOn(recipeCreators, 'deleteRecipe')
      .mockImplementation(() => {return () => {}})
    })

    afterEach(() => {
      jest.clearAllMocks();
    })
  
    it('should render Detailpage', () => {
      const component = mount(detailpage);
      const wrapper = component.find('Detailpage');
      expect(wrapper.length).toBe(1)
    });

    it('should delete recipe', async () => {
      const spyPush = jest.spyOn(history, 'push');
      let component = mount(detailpage);
      await fflushPromises();
      component.update();
      let wrapper = component.find('#delete-button');
      expect(spyIsLogin).toHaveBeenCalledTimes(1);
      wrapper.simulate('click')
      expect(spyDeleteRecipe).toHaveBeenCalledTimes(1)
      wrapper = component.find('#edit-button');
      wrapper.simulate('click');
      expect(spyPush).toHaveBeenCalledTimes(1);
    })

    it('should work removelike', async () => {
      const spyRemoveLikeRecipe = jest.spyOn(recipeCreators, 'removelikeRecipe')
        .mockImplementation(() => {
          return dispatch => {}
        })
      let component = mount(detailpage);
      await fflushPromises();
      component.update();
      const wrapper = component.find('#spylike');
      wrapper.simulate('click');
      expect(spyRemoveLikeRecipe).toHaveBeenCalledTimes(1);
    })
    it('should work like', async () => {
      const spyLikeRecipe = jest.spyOn(recipeCreators, 'likeRecipe')
        .mockImplementation(() => {
          return dispatch => {}
        })
      spyIsLogin = jest.spyOn(userCreators, 'isLogin')
        .mockImplementation(() => {
            return () => new Promise((resolve) => {
                const result = {login_id: 3}
                setImmediate(resolve(result))
            })
        })
      let component = mount(detailpage);
      await fflushPromises();
      component.update();
      const wrapper = component.find('#spylike');
      wrapper.simulate('click');
      expect(spyLikeRecipe).toHaveBeenCalledTimes(1);
    })

    it('should work removescrap', async () => {
      const spyRemoveScrapRecipe = jest.spyOn(recipeCreators, 'removescrapRecipe')
        .mockImplementation(() => {
          return dispatch => {}
        })
      let component = mount(detailpage);
      await fflushPromises();
      component.update();
      const wrapper = component.find('#spyscrap');
      wrapper.simulate('click');
      expect(spyRemoveScrapRecipe).toHaveBeenCalledTimes(1);
    })

    it('should work scrap', async () => {
      const spyScrapRecipe = jest.spyOn(recipeCreators, 'scrapRecipe')
        .mockImplementation(() => {
          return dispatch => {}
        })
      spyIsLogin = jest.spyOn(userCreators, 'isLogin')
        .mockImplementation(() => {
            return () => new Promise((resolve) => {
                const result = {login_id: 4}
                setImmediate(resolve(result))
            })
        })
      let component = mount(detailpage);
      await fflushPromises();
      component.update();
      const wrapper = component.find('#spyscrap');
      wrapper.simulate('click');
      expect(spyScrapRecipe).toHaveBeenCalledTimes(1);
    })

    it('show dishstep', async () => {
      let component = mount(detailpage);
      let wrapper = component.find(DishStep);
      expect(wrapper.length).toBe(2);
    })

    it('should show image', () => {
      mockStore = getMockStore({})
      detailpage = (
        <Provider store={mockStore}>
          <Router history={history}>
              <Detailpage match={{params:{id:1}}}/>
          </Router>
        </Provider>
      );
      let component = mount(detailpage);
      let wrapper = component.find(DishResult).get(0);
      let wrapper2 = wrapper.props.img;
      expect(wrapper2.props.src).toBe(null)
    })
});