import React from 'react';
import { shallow } from 'enzyme';
import SimpleUserInfo from './SimpleUserInfo';

describe('<SimpleUserInfo />', () => {
  it('should render without errors', () => {
    const component = shallow(<SimpleUserInfo />);
    const wrapper = component.find(".SimpleUserInfo");
    expect(wrapper.length).toBe(1);
  });

  it('should render username of the recipe', () => {
    const component = shallow(<SimpleUserInfo username={'TEST_AUTHOR'} />);
    const wrapper = component.find('#showuser');
    expect(wrapper.at(0).text()).toEqual('username:\u00A0\u00A0\u00A0TEST_AUTHOR');
  });

  it('should render email of the recipe', () => {
    const component = shallow(<SimpleUserInfo email={'TEST_TITLE'} />);
    const wrapper = component.find('#showuser');
    expect(wrapper.at(1).text()).toEqual('email:\u00A0\u00A0\u00A0TEST_TITLE');
  });

});