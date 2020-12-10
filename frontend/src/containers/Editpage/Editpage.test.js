import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history' ;

import * as recipeCreators from '../../store/actions/recipe';
import {getMockStore} from '../../test-utils/mocks.js'
import Editpage from './Editpage'
import EditDishResult from './EditDishResult';

const stubState = {
  selectedRecipe: {
    'title': 'test_title',
    'price': 100,
    'duration': 'test_duration',
    'rating': 3,
    'likes': 4,
    'category': 1,
    'summary': 'test_summary',
    'ingredient_list': [
      {'name': 'ingredient', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
      'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}],
    'photo_list': ['test_image'],
    'thumbnail': 'test_thumbnail',
    'description_list': ['test_step1']

  }
}
const stubDescriptionList = ['text1', 'text2']

const mockHistory = createBrowserHistory()
const mockStore = getMockStore(stubState)

/*jest.mock('../comments/Comments', () => {
    return jest.fn(() => {
      return (
          <div className="Comments">
            <h1>Hello</h1>
          </div>
      )
  })
})*/
jest.mock('./EditDishResult', () => (props) => {
  return (
        <input id="spyUpdateState" onChange={(event) => props.updateState('title', event.target.value)}/>
  )
})

describe('<Editpage />', () => {
    let editpage;
    const fflushPromises = () => {
      return new Promise(resolve => setImmediate(resolve));
    }
    const mock_alert = jest.spyOn(window, 'alert')
    .mockImplementation((arg) => {})
    beforeEach(() => {
      editpage = (
          <Provider store={mockStore}>
            <Router history={mockHistory}>
                <Editpage />
            </Router>
          </Provider>
        );
    })

    afterEach(() => {
      jest.clearAllMocks();
    })
  
    it('should render Editpage and test basic buttons', () => {
      const component = mount(editpage);
      let wrapper = component.find('Editpage');
      let instance = component.find(Editpage.WrappedComponent).instance()

      instance.setState({ingredient_list: [
        {'name': '', 'quantity': 100, 'price': 0, 'price_normalized': 10,
        'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}], description_list:[], photo_list:[]})
      wrapper = component.find('#submit')
      wrapper.at(0).simulate('click')
      expect(mock_alert).toHaveBeenCalledTimes(1);

      
      expect(wrapper.length).toBe(1)
      
      wrapper = component.find(EditDishResult);
      expect(wrapper.length).toBe(1);
      wrapper = component.find('#editaddstep')
      expect(wrapper.length).toBe(1);
      wrapper.simulate('click')
      wrapper = component.find('.edit-dish_step');
      expect(wrapper.length).toBe(1);

      wrapper = component.find('#edittitle')
      wrapper.at(0).simulate('change', {target: {value: 'text'}})
      expect(instance.state.description_list[0]).toBe('text')

      const mockReader = {
        onloadend: jest.fn(),
        result: 'test_result',
        readAsDataURL: jest.fn(() => {
          return mockReader.onloadend()
        })
      }
      window.FileReader = jest.fn(() => {
        return mockReader
      })
      wrapper = component.find('#imageHandler')
      wrapper.at(0).simulate('change', {target: {files: ['image1', 'imge2']}})
      expect(mockReader.readAsDataURL).toHaveBeenCalledTimes(1);

      wrapper = component.find('.dish_explanation #delete-button')
      wrapper.at(0).simulate('click')
      wrapper = component.find('.edit-dish_step');
      expect(wrapper.length).toBe(0);
    });

    it('should call get and edit Recipe', async() => {
      let mockGetRecipe = jest.spyOn(recipeCreators, 'getRecipe')
        .mockImplementation((id) => {
          return () => new Promise((resolve) => {
            const result = stubState;
            setImmediate(resolve(result))
          })
        })
      let mockEditRecipe = jest.spyOn(recipeCreators, 'editRecipe')
        .mockImplementation((data, id) => {
          return () => new Promise((resolve) => {
            const result = {};
            setImmediate(resolve(result))
          })
        })
      const component = mount(editpage);
      await fflushPromises();
      expect(mockGetRecipe).toHaveBeenCalledTimes(1);
      const wrapper = component.find('#submit')
      wrapper.at(0).simulate('click')
      await fflushPromises();
      expect(mockEditRecipe).toHaveBeenCalledTimes(1);
    })
 
    it('should updateState', () => {
      const updateState = jest.fn();
      const component = mount(editpage);
      const wrapper = component.find('#spyUpdateState');
      wrapper.simulate('change', {target: {value: 'edited'}});
      const instance = component.find(Editpage.WrappedComponent).instance();
      expect(instance.state.title).toBe('edited');
    })

    it('should check checkOutput', () => {
      const component = mount(editpage);
      const instance = component.find(Editpage.WrappedComponent).instance();
      instance.setState({});
      const wrapper = component.find('#submit')
      wrapper.at(0).simulate('click')
      expect(mock_alert).toHaveBeenCalledTimes(1);
    })
})
       