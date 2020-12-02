import React from 'react';
import { mount } from 'enzyme';
import { createBrowserHistory } from 'history' ;
import { Provider } from 'react-redux';

import App from './App';
import {getMockStore} from './test-utils/mocks'
import Navbar from './containers/Navbar/Navbar';


jest.mock('./containers/Createpage/Createpage', () => {
  return jest.fn(() => {
    return (
      <div id='create-page'>
        <p>Random stuff</p>
      </div>
    )
  })
})

jest.mock('./containers/detailpage/Detailpage', () => {
  return jest.fn(() => {
    return (
      <div id='create-page'>
        <p>Random stuff</p>
      </div>
    )
  })
})

jest.mock('./containers/RecipeList/RecipeList', () => {
  return jest.fn(() => {
    return (
      <div id='create-page'>
        <p>Random stuff</p>
      </div>
    )
  })
})

const stubState = {}

const history = createBrowserHistory()
const mockStore = getMockStore(stubState)


describe('<App />', () => {
  let app;
  beforeEach(()=>{
    app = (
      <Provider store={mockStore}>
        
            <App history={history}>
            <Navbar></Navbar>
            </App>
      </Provider>
    )
  })
  it('should render without errors', () => {
    const component = mount(app);
    const wrapper = component.find('.App');
    expect(wrapper.length).toBe(1);
  });

  it('should render create', () => {
    history.push('/create')
    mount(app)
  })

  it('should render detail', () => {
    history.push('/detail-page')
    mount(app)
  })

  it('should render custom 404 page', () => {
    history.push('/random')
    mount(app)
  })
});