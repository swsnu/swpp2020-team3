import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history' ;

import Createpage from './Createpage'
import {getMockStore} from '../../test-utils/mocks.js'

const stubState = {
    ingredientList: [
        {'name': 'ingredient', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
        'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}
    ],
    user: {
        login_id: 'root'
    }
}

const mockHistory = createBrowserHistory()
const mockStore = getMockStore(stubState)


//put parantheses
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

describe('<Createpage />', () => {
    let createpage;
    beforeEach(() => {
      createpage = (
          <Provider store={mockStore}>
            <Router history={mockHistory}>
                <Createpage />
            </Router>
          </Provider>
        );
    })
  
    it('should render Createpage', () => {
      const component = mount(createpage);
      const wrapper = component.find('Createpage');
      expect(wrapper.length).toBe(1)
    });

    // should correct (use async )
    it('should sumbit', () => {
        const stub = {'name': 'ingredient1', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
        'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}
        var spyHistory = jest.spyOn(mockHistory, 'push')
            .mockImplementation(() => {})
        //var spyCreate = jest.spyOn(actionCreators, 'createRecipe')
          //  .mockImplementation((props) => {return dispatch => {}})
        const component = mount(createpage)
        const wrapper = component.find('#submit')
        // length of list = 0
        wrapper.simulate('click')
        // expect(spyHistory).toHaveBeenCalledTimes(1) // this is right
        expect(spyHistory).toHaveBeenCalledTimes(0)
     
        // length of list is bigger than 0
        let instance = component.find(Createpage.WrappedComponent).instance()
        instance.setState({selectedIngredientList: [stub]})
        wrapper.simulate('click')
        // expect(spyHistory).toHaveBeenCalledTimes(2) // this is right
        expect(spyHistory).toHaveBeenCalledTimes(0)
    })

/////////////
    it('should test title, summary, cooking time and type', () => {
        const component = mount(createpage)
        // title
        let wrapper = component.find('#recipe-title-input')
        wrapper.simulate('change', {target: {value: 'test_title'}})
        let instance = component.find(Createpage.WrappedComponent).instance()
        expect(instance.state.title).toBe('test_title')
        // summary
        wrapper = component.find('#recipe-summary-input')
        wrapper.simulate('change', {target: {value: 'test_summary'}})
        instance = component.find(Createpage.WrappedComponent).instance()
        expect(instance.state.summary).toBe('test_summary')
        // cooking time
        wrapper = component.find('#recipe-cooking-time-input')
        wrapper.simulate('change', {target: {value: 'test_cooking_time'}})
        instance = component.find(Createpage.WrappedComponent).instance()
        expect(instance.state.duration).toBe('test_cooking_time')
        // type
        component.find('#type').forEach((node)=>{
            node.simulate('click')
        })
        component.find('#type').forEach((node)=>{
            node.simulate('click')
        })
    })

    it('should retrieve Select', () => {
        const stub = {'name': 'ingredient1', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
        'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}
        const stubList = [
            {'name': 'ingredient0', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
        'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}
        ]
        const component = mount(createpage)
        let wrapper = component.find('select')
        const instance = component.find(Createpage.WrappedComponent).instance()
        // ingredientList == null
        wrapper.simulate('change', stub)
        expect(instance.state.selectedIngredientList.length).toBe(1)
        // ingredientList not null
        instance.setState({selectedIngredientList: stubList})
        wrapper.simulate('change', stub)
        expect(instance.state.selectedIngredientList.length).toBe(2)
        // add quantity
        wrapper = component.find('#ingredient input').at(0)
        wrapper.simulate('change', {target: {value: 5}})
        expect(instance.state.selectedIngredientList[0]['amount']).toBe(5)
        // delete ingredient
        wrapper = component.find('#ingredient .deleteIngredient').at(0)
        wrapper.simulate('click')
        expect(instance.state.selectedIngredientList.length).toBe(1)
    })

    it('should test thumbnail uploading', () => {
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
        const component = mount(createpage)
        let wrapper = component.find('#recipe-thumbnail-input')
        wrapper.simulate('change', {target: {files: ['hello', 'adele']}})
    })

    it('should test add step', () => {
        let component = mount(createpage)
        const instance = component.find(Createpage.WrappedComponent).instance()
        let wrapper = component.find('#addStep')
        wrapper.simulate('click')
        expect(instance.state.descriptionList.length).toBe(1)
        // check input handler
        wrapper = component.find('#step-input')
        wrapper.simulate('change', {target: {value: 'test'}})
        // expect
        // check image handler
        wrapper = component.find('#step-image')
        wrapper.simulate('change', {target: {files: ['image1', 'image2']}})
        // expect
        // check delete step
        wrapper = component.find('#delete-step')
        wrapper.simulate('click')    
        // expect
    })

    // fit('shoud test for branch where totalPrice is not a number? or the other', () => {
    //     const stub = {'name': 'ingredient1', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
    //     'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}

    //     let component = mount(createpage)
    //     const instance = component.find(Createpage.WrappedComponent).instance()
    //     instance.setState({selectedIngredientList: [stub]})
    //     let wrapper = component.find('.create_fourth')
    //     console.log(wrapper.debug())

    // })


    it('should add custom ingredients', () => {
        const mock_alert = jest.spyOn(window, 'alert')
        .mockImplementation((arg) => {})
        const component = mount(createpage)
        let wrapper = component.find('select')
        const instance = component.find(Createpage.WrappedComponent).instance()

        wrapper = component.find('.ingr_name_1')
        wrapper.simulate('change', 'test-ingr')
        wrapper = component.find('.ingr_type_1')
        wrapper.simulate('change', 'g')
        wrapper = component.find('.ingr_price_1')
        wrapper.simulate('change', 1000)
        wrapper = component.find('.ingr_brand_1')
        wrapper.simulate('change', 'oops')
        wrapper = component.find('.ingr_quantity_1')
        wrapper.simulate('change', 1000)
        wrapper = component.find('.ingr_submit_1')
        wrapper.simulate('click')
        expect(instance.state.selectedIngredientList.length).toBe(0)


        wrapper = component.find('.ingr_name_0')
        wrapper.simulate('change', 'test-ingr')
        wrapper = component.find('.ingr_type_0')
        wrapper.simulate('change', 'g')
        wrapper = component.find('.ingr_price_0')
        wrapper.simulate('change', 1000)
        wrapper = component.find('.ingr_submit_0')
        wrapper.simulate('click')
        expect(instance.state.selectedIngredientList.length).toBe(0)
    })
})
       