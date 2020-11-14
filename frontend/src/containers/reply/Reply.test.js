import React from 'react';
import { shallow } from 'enzyme';
import Reply from './Reply';

describe('<Reply />', () => {
  it('should render without errors', () => {
    const component = shallow(<Reply />);
    const wrapper = component.find(".reply");
    expect(wrapper.length).toBe(1);
  });

  it('should handle deleteReply', () => {
    const mockClickDelete = jest.fn();
    const component = shallow(<Reply onDeleteReply={mockClickDelete} />);
    const wrapper = component.find('#delete-reply-button');
    wrapper.simulate('click');
    expect(mockClickDelete).toHaveBeenCalledTimes(1);
  });

  it('should handle editReply 1', () => {
    const spyPrompt1 = jest.spyOn(window, 'prompt').mockImplementation(() => 'yes');
    const mockClickEdit = jest.fn();
    const component = shallow(<Reply onEditReply={mockClickEdit}/>);
    const wrapper = component.find('#edit-reply-button');
    wrapper.simulate('click');
    //expect(component.onEdit()).toHaveBeenCalledTimes(1);
    expect(spyPrompt1).toHaveBeenCalledTimes(1);
    expect(mockClickEdit).toHaveBeenCalledTimes(1);
  });

  it('should handle editReply 2', () => {
    const spyPrompt2 = jest.spyOn(window, 'prompt').mockImplementation(() => '');
    const mockClickEdit = jest.fn();
    const component = shallow(<Reply onEditReply={mockClickEdit}/>);
    const wrapper = component.find('#edit-reply-button');
    wrapper.simulate('click');
    //expect(component.onEdit()).toHaveBeenCalledTimes(1);
    expect(spyPrompt2).toHaveBeenCalledTimes(2); 
    expect(mockClickEdit).toHaveBeenCalledTimes(0);
  });
  
});