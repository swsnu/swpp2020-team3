import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history' ;

import {getMockStore} from '../../test-utils/mocks.js'
import Editpage from './Editpage'

const stubState = {
  selectedRecipe: {
    'ingredient_list': [
      {'name': 'ingredient', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
      'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}],
    'photo_list': ['test_image'    ]
  }
}
const stubDescriptionList = ['text1', 'text2']

const mockHistory = createBrowserHistory()
const mockStore = getMockStore(stubState)

jest.mock('../comments/Comments', () => {
    return jest.fn(() => {
      return (
          <div className="Comments">
            <h1>Hello</h1>
          </div>
      )
  })
})
jest.mock('./EditDishResult', () => (updateState) => {
  return (
        <input onChange={(event) => updateState(event.target.value), 1}/>
  )
})

describe('<Editpage />', () => {
    let editpage;

    beforeEach(() => {
      editpage = (
          <Provider store={mockStore}>
            <Router history={mockHistory}>
                <Editpage />
            </Router>
          </Provider>
        );
    })
  
    it('should render Editpage and test basic buttons', () => {
      const component = mount(editpage);
      let wrapper = component.find('Editpage');
      let instance = component.find(Editpage.WrappedComponent).instance()
      instance.setState({description_list: stubDescriptionList, photo_list: ['photo1', 'photo2']})
      expect(wrapper.length).toBe(1)

      wrapper = component.find('#detailmethod button')
      wrapper.simulate('click')

      wrapper = component.find('#submit')
      wrapper.at(0).simulate('click')

      wrapper = component.find('#detailtitle')
      wrapper.at(0).simulate('change', {target: {value: 'text'}})

      wrapper = component.find('.dish_explanation #delete-button')
      wrapper.at(0).simulate('click')

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
      console.log(wrapper.debug())
      wrapper.at(0).simulate('change', {target: {files: ['image1', 'imge2']}})
    });

   
 
})
       