import { mount, shallow } from 'enzyme';
import React from 'react';
import Footer from './Footer'

describe('<Footer />', () => {
  it('should render Footer', () => {
      const component = shallow(<Footer/>);
      const wrapper = component.find('.Footer');
      expect(wrapper.length).toBe(1);
  })
})