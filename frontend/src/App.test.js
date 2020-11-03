import React from 'react';
import { shallow, mount } from 'enzyme';
import {BrowserRouter, Router, Route, Redirect, Switch} from 'react-router-dom';
import { createBrowserHistory } from 'history' ;

import App from './App';


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

const history = createBrowserHistory()


describe('<App />', () => {
  let app;
  beforeEach(()=>{
    app = (
        <Router history={history}>
            <App history={history}>
            </App>
        </Router>
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