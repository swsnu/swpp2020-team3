import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history' ;
import {getMockStore} from '../../test-utils/mocks.js'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


import * as recipeCreators from '../../store/actions/recipe';
import * as userCreators from '../../store/actions/userCreators';
import Mealplanner from './Mealplanner'

const stubState = {
  selectedRecipe: {
    'ingredient_list': [
      {'name': 'ingredient', 'quantity': 100, 'price': 1000, 'price_normalized': 10,
      'igd_type': 'g', 'brand': 'CU', 'picutre': 'image'}],
    'photo_list': ['test_image'    ]
  }
}
const stubRecipeArray = [[{ id: 1, thumbnail: 0, real_id: 0 }, { id: 2, thumbnail: 0, real_id: 0}, { id: 3, thumbnail: 0, real_id: 0}],
[{ id: 4, thumbnail: 0, real_id: 0 }, { id: 5, thumbnail: 0, real_id: 0 }, { id: 6, thumbnail: 0, real_id: 0 }],
[{ id: 7, thumbnail: 0, real_id: 0 }, { id: 8, thumbnail: 0, real_id: 0 }, { id: 9, thumbnail: 0, real_id: 0 }]]
const stubRecipeArrayOver = [[{ id: 1, thumbnail: 0, real_id: 0 }, { id: 2, thumbnail: 0, real_id: 0}, { id: 3, thumbnail: 0, real_id: 0}],
[{ id: 4, thumbnail: 0, real_id: 0 }, { id: 5, thumbnail: 0, real_id: 0 }, { id: 6, thumbnail: 0, real_id: 0 }],
[{ id: 7, thumbnail: 0, real_id: 0 }, { id: 8, thumbnail: 0, real_id: 0 }, { id: 9, thumbnail: 0, real_id: 0 }],
[{ id: 7, thumbnail: 0, real_id: 0 }, { id: 8, thumbnail: 0, real_id: 0 }, { id: 9, thumbnail: 0, real_id: 0 }],
[{ id: 7, thumbnail: 0, real_id: 0 }, { id: 8, thumbnail: 0, real_id: 0 }, { id: 9, thumbnail: 0, real_id: 0 }],
[{ id: 7, thumbnail: 0, real_id: 0 }, { id: 8, thumbnail: 0, real_id: 0 }, { id: 9, thumbnail: 0, real_id: 0 }],
[{ id: 7, thumbnail: 0, real_id: 0 }, { id: 8, thumbnail: 0, real_id: 0 }, { id: 9, thumbnail: 0, real_id: 0 }],
[{ id: 7, thumbnail: 0, real_id: 0 }, { id: 8, thumbnail: 0, real_id: 0 }, { id: 9, thumbnail: 0, real_id: 0 }]]
const stubRecipeArrayUnder = [[{ id: 1, thumbnail: 0, real_id: 0 }, { id: 2, thumbnail: 0, real_id: 0}, { id: 3, thumbnail: 0, real_id: 0}]]

const history = createBrowserHistory()
const mockStore = getMockStore(stubState)

jest.mock('react-beautiful-dnd', (onDragEnd) => ({
  Droppable: ({ children }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
  }, {}),
  Draggable: ({ children }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
  }, {}),
  // DragDropContext: ({ children }) => children({
  //   onDragEnd: jest.fn()
  // }, {}),
  DragDropContext: ({ children }) => {
    //children = {...children, onDragEnd: onDragEnd}
    return children
  },
}));


describe('<Mealplanner />', () => {
  let spyOnGetRecipe = jest.spyOn(recipeCreators, 'getRecipes')
      .mockImplementation(() => {
          return () => new Promise((resolve) => {
              const result = stubRecipeArray
              setImmediate(resolve(result))
          })
      })
  const fflushPromises = () => {
    return new Promise(resolve => setImmediate(resolve))
  }
    let mealplanner //, spyOnGetRecipe;
    beforeEach(() => {
      mealplanner = (
        <Provider store={mockStore}>
          <Router history={history}>
              <Mealplanner/>
          </Router>
        </Provider>
      );
    })

    afterEach(() => {
      jest.clearAllMocks();
    })
  
    it('should render Mealplanner', async() => {
      // let spyHistory = jest.spyOn(history, 'push')
      // .mockImplementation(() => {})

      // let spyOnGetRecipe = jest.spyOn(actionCreators, 'getRecipes')
      //   .mockImplementation(() => {
      //   return () => new Promise((resolve) => {
      //     const result = {randomRecipe: stubRecipeArray}
      //     setImmediate(resolve(result))
      //   })
      // })

      // const spyOnGetRecipe = jest.spyOn(actionCreators, 'getRecipes')
      //     .mockImplementation(() => {})

      const component = mount(mealplanner);
      await fflushPromises();
      component.update();
      expect(spyOnGetRecipe).toHaveBeenCalledTimes(0)
      let wrapper = component.find('Mealplanner');
      expect(wrapper.length).toBe(1)
    });

    it('should test searchbar and draggable', () => {
      const component = mount(mealplanner)
      let wrapper;
      // wrapper = component.find('.Searchbar #min')
      // wrapper.simulate('change', {target: {value: 'test'}})
      // wrapper = component.find('.Searchbar #max')
      // wrapper.simulate('change', {target: {value: 'test'}})
      wrapper = component.find('.Searchbar #numOfDays')
      wrapper.simulate('change', {target: {value: 'test'}})
      wrapper = component.find('.Searchbar button')
      wrapper.simulate('click')

      let instance = component.find(Mealplanner.WrappedComponent).instance()
      instance.setState({recipeArray: stubRecipeArrayOver})
      wrapper = component.find('#addDayAbove')
      wrapper.forEach((button) => button.simulate('click'))
      instance = component.find(Mealplanner.WrappedComponent).instance()
      instance.setState({recipeArray: stubRecipeArrayUnder})
      wrapper = component.find('deleteDay')
      wrapper.forEach((button) => button.simulate('click'))
    })

    it('should test day', () => {
      const component = mount(mealplanner)
      let wrapper = component.find('button')
      wrapper.forEach((button) => {
        button.simulate('click')
      })
    })

    it('should test scrappedRecipe', () => {
      let spyHistory = jest.spyOn(history, 'push')
      .mockImplementation(() => {})
      const component = mount(mealplanner)
      let wrapper = component.find('.scrappedRecipe img')
      // wrapper.forEach(image => {
      //   image.simulate('click')
      // })
      wrapper.at(0).simulate('click')
      expect(spyHistory).toHaveBeenCalledTimes(1)
      
    })

    it('should click singleblock', () => {
      let spyHistory = jest.spyOn(history, 'push')
      const component = mount(mealplanner);
      const instance = component.find(Mealplanner.WrappedComponent).instance();
      instance.setState({recipeArray: [[{id: 1, thumbnail: 1, real_id: 1}]]})
      component.update();
      let wrapper = component.find('.singleBlock img')
      wrapper.simulate('click')
      expect(spyHistory).toHaveBeenCalledTimes(1);
    })

    it('test onDragEnd', () => {
      const component = mount(mealplanner);
      const instance = component.find(Mealplanner.WrappedComponent).instance();
      let source, destination;
      instance.onDragEnd({source, destination});

      destination = {droppableId: 'a', index: 1};
      source = {droppableId: 'a', index: 0}
      instance.onDragEnd({source, destination});

      destination = {droppableId: 'aday', index: 1};
      source = {droppableId: 'aday', index: 0}
      instance.onDragEnd({source, destination});

      destination = {droppableId: 'aday', index: 2};
      source = {droppableId: 'aday', index: 0}
      instance.onDragEnd({source, destination});

      destination = {droppableId: 'bday', index: 1};
      source = {droppableId: 'aday', index: 0}
      instance.onDragEnd({source, destination});
    })

    it('test generatAllML', () => {
      const component = mount(mealplanner);
      const instance = component.find(Mealplanner.WrappedComponent).instance();
      instance.setState({recipes: [1, 2, 3, 4, 5, 6, 7, 8, 9]})
      instance.generateAllML();
    })

    it('test deleteDay', () => {
      const component = mount(mealplanner);
      const instance = component.find(Mealplanner.WrappedComponent).instance();
      instance.setState({recipeArray: [['a']]});
      instance.deleteDay();
    })

    it('test login', () => {
      const spyGetRecipes = jest.spyOn(recipeCreators, 'getRandom')
        .mockImplementation(() => {
          return () => new Promise(resolve => {
            const result = {randomRecipe: []}
            setImmediate(resolve(result));
          })
        })
      const spyIsLogin = jest.spyOn(userCreators, 'isLogin')
        .mockImplementation(() => {
          return () => new Promise(resolve => {
            const result = {login_id: 1};
            setImmediate(resolve(result))
          })
        })
      const spyGetMls = jest.spyOn(recipeCreators, 'getMl')
        .mockImplementation((id) => {
          return () => new Promise(resolve => {
            const result = {mlRecipes: []};
            setImmediate(resolve(result))
          })
        })
      const component = mount(mealplanner);
      const instance = component.find(Mealplanner.WrappedComponent).instance();
    })

});