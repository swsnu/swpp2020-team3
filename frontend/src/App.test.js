import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import App from './App';

describe('<App />', () => {
  it('should render without errors', () => {
    const component = mount(<App />);
    const wrapper = component.find('.App');
    expect(wrapper.length).toBe(1);
  });
});