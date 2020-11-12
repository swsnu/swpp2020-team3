import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter} from 'connected-react-router';
import {BrowserRouter, Router,Route, Redirect, Switch} from 'react-router-dom';
import { createBrowserHistory } from 'history' ;
import Select from 'react-select'

import Createpage from './Createpage'
import CreateStep from './CreateStep'
import {getMockStore} from '../../test-utils/mocks.js'
import * as actionCreators from '../../store/actions/recipe';

const stubState = {
    ingredientList: [
        {'name': 'ingredient', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
        'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}
    ]
}

const history = createBrowserHistory()
const mockStore = getMockStore(stubState)

function MockFile() {}

MockFile.prototype.create = function(name, size, mimeType) {
    name = name || 'mock.txt';
    size = size || 1024;
    mimeType = mimeType || 'plain/txt';

    function range(count) {
        var output = '';
        for (var i = 0; i < count; i++) {
            output += 'a';
        }
        return output;
    }

    var blob = new Blob([range(size)], { type: mimeType });
    blob.lastModifiedDate = new Date();
    blob.name = name;

    return blob;
};
jest.mock('./CreateStep', () => {
    return jest.fn(() => {
        return (
            <div className="CreateStep">
                <h1>CreateStep</h1>
            </div>
        )
    })
})
jest.mock("react-select", () => ({ options, value, onChange, getOptionLabel }) => {
    function handleChange(event) {
      onChange(event);
    }
    function optionLabel(option){
        console.log(option)
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
    let createpage, spyOnGetIgrList;

    beforeEach(() => {
      createpage = (
          <Provider store={mockStore}>
            <Router history={history}>
                <Createpage />
            </Router>
          </Provider>
        );
        spyOnGetIgrList = jest.spyOn(actionCreators, 'getIngredients')
            .mockImplementation(() => {return dispatch => {}})
    })
  
    it('should render Createpage', () => {
      const component = mount(createpage);
      const wrapper = component.find('Createpage');
      expect(wrapper.length).toBe(1)
    });

    it('should redirect', () => {
        var spyHistory = jest.spyOn(history, 'push')
            .mockImplementation(() => {})
        const component = mount(createpage)
        const wrapper = component.find('#submit')
        wrapper.simulate('click')
        expect(spyHistory).toHaveBeenCalledTimes(1)
    })
/////////////
    it('should test title, summary and cooking time, addStep', () => {
        const component = mount(createpage)
        let wrapper = component.find('#recipe-title-input')
        wrapper.simulate('change', {target: {value: 'test_title'}})
        let instance = component.find(Createpage.WrappedComponent).instance()
        expect(instance.state.title).toBe('test_title')

        wrapper = component.find('#recipe-summary-input')
        wrapper.simulate('change', {target: {value: 'test_summary'}})
        instance = component.find(Createpage.WrappedComponent).instance()
        expect(instance.state.summary).toBe('test_summary')

        wrapper = component.find('#recipe-cooking-time-input')
        wrapper.simulate('change', {target: {value: 'test_cooking_time'}})
        instance = component.find(Createpage.WrappedComponent).instance()
        expect(instance.state.duration).toBe('test_cooking_time')

        component.find('#type').forEach((node)=>{
            node.simulate('click')
        })
        component.find('#type').forEach((node)=>{
            node.simulate('click')
        })

        wrapper = component.find('#addStep')
        wrapper.simulate('click')
    })

    // must complete -- hard 
    xit('should set thumbnail', () => {
        var mock = new MockFile();
        var file = mock.create();
        const component = mount(createpage)
        const wrapper = component.find('#recipe-thumbnail-input')
        wrapper.simulate('change', {target: {files: ['test_thumbnailURI']}})
        const instance = component.find(Createpage.WrappedComponent).instance()
        expect(instance.state.thumbnail).toBe('test_thumbnailURI')
    })

    it('should retrieve Select', () => {
        const stub = {'name': 'ingredient0', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
        'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}
        const stubList = [
            {'name': 'ingredient1', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
        'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'},
        {'name': 'ingredient2', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
        'igd_type': 'g', 'brand': 'GS', 'picutre': 'image'}
        ]
        const component = mount(createpage)
        let wrapper = component.find('select')
        const instance = component.find(Createpage.WrappedComponent).instance()
        instance.setState({selectedIngredientList: stubList})
        wrapper.simulate('change', {'name': 'ingredient0', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
        'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'})
        expect(instance.state.selectedIngredientList.length).toBe(3)

        instance.setState({ingredientList: stubList})
        wrapper.simulate('change', {'name': 'ingredient0', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
        'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'})
        expect(instance.state.selectedIngredientList.length).toBe(4)
    })

    it('should test delete ingredient', () => {
        const stubList = [
            {'name': 'ingredient1', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
        'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'},
        {'name': 'ingredient2', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
        'igd_type': 'g', 'brand': 'GS', 'picutre': 'image'}
        ]
        const component = mount(createpage)
        const instance = component.find(Createpage.WrappedComponent).instance()
        instance.setState({selectedIngredientList: stubList})
        let wrapper = component.find('#ingredient')
        console.log(component.debug())
        wrapper.simulate('click')
    })
})
       