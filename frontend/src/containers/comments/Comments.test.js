import React from 'react';
import ReactDOM from 'react-dom';
import {shallow, mount} from 'enzyme';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router'

import Comment from './Comment';
import Comments from './Comments';
import { getMockStore } from '../test-utils/mocks';
import * as actionCreators from '../store/actions/actionCreators';
import { history } from '../store/store';

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
    
    beforeEach(() => {
        comments = <Provider store={mockStore}>
            <ConnectedRouter history={history}>
                <Comments recipeId={1}/>
            </ConnectedRouter>
        </Provider>
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should render comments', () => {
        const component = mount(comments);
        const wrapepr = component.find('Comments');
        expect(wrapper.length).toBe(1);
        
    })    
})