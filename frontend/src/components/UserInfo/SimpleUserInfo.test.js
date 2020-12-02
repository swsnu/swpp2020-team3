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

  it('should render first name of the recipe', () => {
    const component = shallow(<SimpleUserInfo first_name={'TEST_TITLE'} />);
    const wrapper = component.find('#showuser');
    expect(wrapper.at(1).text()).toEqual('TEST_TITLE');
  });

  it('should render last name of the recipe', () => {
    const component = shallow(<SimpleUserInfo last_name={'TEST_TITLE'} />);
    const wrapper = component.find('#showuser');
    expect(wrapper.at(2).text()).toEqual('TEST_TITLE');
  });

  it('should render email of the recipe', () => {
    const component = shallow(<SimpleUserInfo email={'TEST_TITLE'} />);
    const wrapper = component.find('#showuser');
    expect(wrapper.at(3).text()).toEqual('TEST_TITLE');
  });

});