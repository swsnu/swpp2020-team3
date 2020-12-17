import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history' ;

import {getMockStore} from '../../test-utils/mocks.js'
import EditDishResult from './EditDishResult'
import * as recipeCreator from '../../store/actions/recipe';

const stubState = {
  selectedRecipe: {
    'ingredient_list': [
      {'name': 'ingredient', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
      'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}],
    'photo_list': ['test_image'    ]
  },
  ingredientList: [
    {'name': 'ingredient', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
    'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}
]
}
const mockHistory = createBrowserHistory()
const mockStore = getMockStore(stubState)

jest.mock("react-select", () => ( {options, value, onChange, getOptionLabel} ) => {
  function handleChange(event) {
    onChange(event);
  }
  function optionLabel(option){
      getOptionLabel(option)
  }
  return (
    <select data-testid="select" value={value} onChange={(event) => handleChange(event)}
    getOptionLabel={(option) => optionLabel(option)}>
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
});

describe('<Editpage />', () => {
    let editdishresult; 
    const updateState = jest.fn()
    const fflushPromises = () => {
      return new Promise(resolve => setImmediate(resolve));
    }

    beforeEach(() => {
      editdishresult = (
          <Provider store={mockStore}>
            <Router history={mockHistory}>
                <EditDishResult updateState={updateState}/>
            </Router>
          </Provider>
        );
    })
    afterEach(() => {
      jest.clearAllMocks();
    })
  
    it('should render EditDishResult and test basic buttons', () => {
      const component = mount(editdishresult);
      let wrapper = component.find('EditDishResult');
      let instance = component.find(EditDishResult.WrappedComponent).instance()
      instance.setState({category: []})

      expect(wrapper.length).toBe(1)

      wrapper = component.find('#detailtitle')
      wrapper.simulate('change', {target: {value: 'text'}})

      wrapper = component.find('#detailabstraction')
      wrapper.simulate('change', {target: {value: 'text'}})

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
      wrapper.simulate('change', {target: {files: ['image1', 'image2']}})


      //wrapper = component.find('.add-ingredient-quantity')
      //wrapper.simulate('change', {target: {value: 'text'}})

      wrapper = component.find('#type')
      wrapper.forEach(button => {
        button.simulate('click')
      })

      wrapper = component.find('.deleteIngredient')
      wrapper.simulate('click')

      wrapper = component.find('select')
      wrapper.at(0).simulate('change', {target: {value: 'text'}})

      wrapper = component.find('#recipe-cooking-time-input');
      wrapper.simulate('change', {target:{value: 'text'}})

      wrapper = component.find('#ingredient').at(0).find('input').at(0);
      wrapper.simulate('change', {target: {value: 1}})

      wrapper = component.find('#detailinfo button');
      wrapper.forEach(button => {
        button.simulate('click');
      })
    });

    /*it('should handle ingrestate is null', () => {
      const component = mount(editdishresult);
      let instance = component.find(EditDishResult.WrappedComponent).instance()
      instance.setState({ingredientList: null})

      const wrapper = component.find('select');
      wrapper.simulate('change', {})
    })*/

    it('should call getIngredients', async () => {
      const component = mount(editdishresult)
      fflushPromises();
      //expect(mockGetRecipe).toHaveBeenCalledTimes(1);
    })
   
 
})
       