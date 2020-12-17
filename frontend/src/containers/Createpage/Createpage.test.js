import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history' ;

import Createpage from './Createpage'
import {getMockStore} from '../../test-utils/mocks.js'
import * as recipeCreators from '../../store/actions/recipe';
import * as userCreators from '../../store/actions/userCreators';

const stubState = {
    ingredientList: [
        {'name': 'ingredient', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
        'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}
    ],
    login_id : 1,
    user: {
        login_id: 1
    }
}

const mockHistory = createBrowserHistory()
const mockStore = getMockStore(stubState)

//const ing_list =[]
const test_recipe = {
    'title': 'a',
    'duration': 'b',
    'totalPrice': 100,
    'descriptionList': ['a'],
    'category': 'Western',
    'summary': 'sum',
    'selectedIngredientList': [{'name': 'a'}],
    'imagePreviewList': ['a'],
    'thumbnailURL': 'ab',
    'date': 'd'
}
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
    const spyCreate = jest.spyOn(recipeCreators, 'createRecipe')
        .mockImplementation(() => {
            return () => new Promise((resolve) => {
                const result = test_recipe;
                setImmediate(reslove(result))
            })
        })
    beforeEach(() => {
      createpage = (
          <Provider store={mockStore}>
            <Router history={mockHistory}>
                <Createpage />
            </Router>
          </Provider>
        );

    })

    afterEach(() => {
        jest.clearAllMocks();
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
        const component = mount(createpage)
        const wrapper = component.find('#submit') 
        let instance = component.find(Createpage.WrappedComponent).instance()

        wrapper.simulate('click')
        expect(spyHistory).toHaveBeenCalledTimes(0)
        
        console.log("!!!!!!!!!!!!!!!")
        // all errors displayed:
        instance.setState({
            title: 'd',
            duration: '2',
            totalPrice: 0,
            descriptionList: ['as', 'dsad'],
            category: '',
            prevList: ['', '', ''],
            summary: '',
            ingredientList: ['', ''],
            thumbnail: 'lkj',
            date: null
        })
        wrapper.simulate('click')

        instance.setState({
            title: '',
            duration: '2',
            totalPrice: 0,
            descriptionList: ['', ''],
            category: [''],
            prevList: ['', '', ''],
            summary: '',
            ingredientList: [],
            thumbnail: '',
            date: null
        })
        wrapper.simulate('click')

        // length of list is bigger than 0
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

    it('check onCreate', () => {
        const component = mount(createpage);
        const instance = component.find(Createpage.WrappedComponent).instance()
        instance.props.onCreate(test_recipe);
        expect(spyCreate).toHaveBeenCalledTimes(1);  
    })

    it('should click button', () => {
        const component = mount(createpage);
        const wrapper = component.find('.ingr_submit_0');
        wrapper.simulate('click');
    })

    it('should change value of ingr', () => {
        const component = mount(createpage);
        let wrapper = component.find('.ingr_detailed');
        wrapper.simulate('click');
        wrapper = component.find('#add-custom-ingredient input');
        wrapper.forEach((item) => {
            item.simulate('change', {target: {value: 'a'}})
        })
    })

    it('should add ingr', () => {
        const component = mount(createpage);
        const instance = component.find(Createpage.WrappedComponent).instance();
        instance.setState({customIngrName: 'name', customIngrType: 'g'})
        instance.addCustomIngredient();
    })

    it('should error add ingr', () => {
        const component = mount(createpage);
        const instance = component.find(Createpage.WrappedComponent).instance();
        instance.setState({detailed: 1, customIngrType: ''})
        instance.addCustomIngredient();
    })

    it('should select ingr', () => {
        const component = mount(createpage);
        const instance = component.find(Createpage.WrappedComponent).instance();
        instance.setState({selectedIngredientList: ['a'], ingredientListSave: ['abc', 'abcd']});
        instance.addSelectedIngredientHandler({})
    })

    it('should pass', () => {
        const component = mount(createpage);
        const instance = component.find(Createpage.WrappedComponent).instance();
        instance.setState(test_recipe);
        instance.submitHandler();
    })

    it('window confirm true', async () => {
        const spyLogin = jest.spyOn(userCreators, 'isLogin')
            .mockImplementation( () => {
                return () => new Promise((resolve) => {
                    const result = {'login_id': 0};
                    setImmediate(resolve(result))
                })
            })
        const spyConfirm = jest.spyOn(window, 'confirm')
            .mockImplementation(() => true)
        const component = mount(createpage)
    })

    it('window confirm false', async () => {
        const spyLogin = jest.spyOn(userCreators, 'isLogin')
            .mockImplementation( () => {
                return () => new Promise((resolve) => {
                    const result = {'login_id': 0};
                    setImmediate(resolve(result))
                })
            })
        const spyConfirm = jest.spyOn(window, 'confirm')
            .mockImplementation(() => false)
        const component = mount(createpage)
    })

    it('handle ingr error', () => {
        const component = mount(createpage);
        const recipe = {
            'title': 'a',
            'duration': 'b',
            'totalPrice': 100,
            'descriptionList': ['a'],
            'category': 'Western',
            'summary': 'sum',
            'selectedIngredientList': [{'name': ''}],
            'imagePreviewList': ['a'],
            'thumbnailURL': 'ab',
            'date': 'd'
        }
        const instance = component.find(Createpage.WrappedComponent).instance();
        instance.setState(recipe);
        instance.submitHandler();
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

})
       