import React from 'react';
import { mount } from 'enzyme';

import Comment from './Comment';

jest.mock('../reply/Replies', () => {
    return jest.fn(props => {
        return (
            <div className='spyReplies'>
                <div>{props.replies}</div>
                <div>{props.commentId}</div>
            </div>
        )
    })
})
describe('<Comment/>', () => {
    let comment;
    const spyEdit = jest.fn();
    const spyDelete = jest.fn();

    beforeEach(() => {
        comment = <Comment replies='test_replies' id='test_id' onEditComment={(comment) => spyEdit(comment)} onDeleteComment={() => spyDelete()} />
    })

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it('should render comment', () => {
        const component = mount(comment);
        const wrapper = component.find('Comment');
        expect(wrapper.length).toBe(1);
        expect(wrapper.find('#edit-comment-button').length).toBe(1);
    })

    it('should toggle replies', () => {
        const component = mount(comment);
        const wrapper = component.find('Comment');
        expect(wrapper.find('.spyReplies').length).toBe(0);
        const toggle = wrapper.find('#toggle-reply-button');
        toggle.simulate('click');
        console.log(component.debug());
        expect(component.find('.spyReplies').length).toBe(1);
    })

    it('should edit well', () => {
        const spyPrompt = jest.spyOn(window, 'prompt')
            .mockImplementation(() => 'a')
        const component = mount(comment);
        const wrapper = component.find('#edit-comment-button');
        wrapper.simulate('click');
        expect(spyPrompt).toHaveBeenCalledTimes(1);
        expect(spyEdit).toHaveBeenCalledTimes(1);
    })

    it('should not edit with empty', () => {
        const spyPrompt = jest.spyOn(window, 'prompt')
            .mockImplementation(() => {});
        const component = mount(comment);
        const wrapper = component.find('#edit-comment-button');
        wrapper.simulate('click');
        expect(spyPrompt).toHaveBeenCalledTimes(1);
        expect(spyEdit).toHaveBeenCalledTimes(0);
    })

    it('should delete well', () => {
        const component = mount(comment);
        const wrapper = component.find('#delete-comment-button');
        wrapper.simulate('click');
        expect(spyDelete).toHaveBeenCalledTimes(1);
    })

})