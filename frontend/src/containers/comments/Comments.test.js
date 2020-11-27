import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router'


import Comments from './Comments';
import { getMockStore } from '../../test-utils/mocks';
import * as replyCreators from '../../store/actions/reply'
import * as commentCreators from '../../store/actions/comment';
import * as userCreators from '../../store/actions/userCreators';
import { history } from '../../store/store'

jest.mock('./Comment', () => {
    return jest.fn(props => {
        return (
            <div className='spyComment'>
                <button id='edit-comment-button' onClick={() => props.onEditComment(props.content)}>Edit</button>
                <button id='delete-comment-button' onClick={() => props.onDeleteComment(props.id)}>Delete</button>
            </div>
        )
    })
})
// const historyMock = { push: jest.fn() };
const stubInitialState = {
    comments: [
        {id: 1, article_id: 1, author_id: 1, content:''},
    ],
    replies: [
        {id: 1, article_id: 1, author_id: 1, content:''},
    ],
}
const mockStore = getMockStore(stubInitialState);

describe('<Comments/>', () => {
    let comments;
    const fflushPromises = () => {
        return new Promise(resolve => setImmediate(resolve));
    }
    let spyIsLogin = jest.spyOn(userCreators, 'isLogin')
        .mockImplementation(() => {
            return () => new Promise((resolve) => {
                const result = {login_id: 1}
                setImmediate(resolve(result))
            })
        })
    
    beforeEach(() => {
        comments = <Provider store={mockStore}>
            <ConnectedRouter history={history}>
                <Comments history={history} recipeId={1}/>
            </ConnectedRouter>
        </Provider>
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    /*it('should render comments', () => {
        const component = mount(comments);
        let wrapper = component.find('Comments');
        expect(wrapper.length).toBe(1);
        wrapper = component.find('.spyComment');
        expect(wrapper.length).toBe(1);
    })   */

    it('should mount well', async () => {
        const spyGetReplySet = jest.spyOn(replyCreators, 'getReplySet')
            .mockImplementation(() => {
                return () => {};
            })
        const spyGetComments = jest.spyOn(commentCreators, 'getComments')
            .mockImplementation(() => {
                return () => new Promise((resolve) => {
                    const result = {comments: [{'id': 1}]}
                    setImmediate(resolve(result))
                })
            })
        mount(comments);
        await fflushPromises();
        expect(spyGetReplySet).toHaveBeenCalledTimes(1);
        expect(spyGetComments).toHaveBeenCalledTimes(1);
    })

    it('should input new comment', () => {
        const component = mount(comments);
        const wrapper = component.find('#new-comment');
        wrapper.simulate('change', {target: {value: 'test_comment'}})
        let newInstance = component.find(Comments.WrappedComponent).instance();
        expect(newInstance.state.content).toBe('test_comment');
    })
    

    it('should add comment', async () => {
        const spyAddComment = jest.spyOn(commentCreators, 'addComment');
        const component = mount(comments);
        let wrapper = component.find('#new-comment');
        wrapper.simulate('change', {target: {value: 'test_comment'}})
        wrapper = component.find('#add-comment');
        expect(wrapper.length).toBe(1);
        wrapper.simulate('click');
        await fflushPromises();
        expect(spyAddComment).toHaveBeenCalledTimes(1);
    })

    it('should not add without login', async () => {
        spyIsLogin = jest.spyOn(userCreators, 'isLogin')
            .mockImplementation(() => {
                return () => new Promise((resolve) => {
                    const result = {login_id: 0}
                    setImmediate(resolve(result))
                })
            })
        // const spyConfirm = jest.spyOn(window, 'confirm')
        //     .mockImplementation(() => true)
        // const spyPush = jest.spyOn(history, 'push')
        //     .mockImplementation(path => {})
        // const spyAddComment = jest.spyOn(commentCreators, 'addComment');
        const component = mount(comments);
        let wrapper = component.find('#new-comment');
        wrapper.simulate('change', {target: {value: 'test_comment'}})
        wrapper = component.find('#add-comment');
        expect(wrapper.length).toBe(1);
        wrapper.simulate('click');
        await fflushPromises();
    })

    it('should pass edit well', () => {
        const spyEdit = jest.spyOn(commentCreators, 'editComment');
        const component = mount(comments);
        const wrapper = component.find('#edit-comment-button')
        wrapper.simulate('click');
        expect(spyEdit).toHaveBeenCalledTimes(1);
    })

    it('should pass delete well', () => {
        const spyDelete = jest.spyOn(commentCreators, 'deleteComment');
        const component = mount(comments);
        const wrapper = component.find('#delete-comment-button')
        wrapper.simulate('click');
        expect(spyDelete).toHaveBeenCalledTimes(1);
    })
})