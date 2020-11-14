import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import { getMockStore } from '../../test-utils/mocks';
import { history } from '../../store/store';
import * as actionCreators from '../../store/actions/reply';
import Replies from './Replies';
import Reply from './Reply';

jest.mock('./Reply', () => {
    return jest.fn(props => {
      return (
        <div className="spyReply">
          <button className = 'spyReplyEdit' onClick={props.onEditReply}>
            {props.content}
          </button>
          <button className = 'spyReplyDelete' onClick={props.onDeleteReply}>
            {props.author}
          </button>
        </div>);
    });
});

const stubInitialState = {
    replies : [
        {id: 1, content: 'asdf1', author: 'qwer1'},
        {id: 2, content: 'asdf2', author: 'qwer2'},
        {id: 3, content: 'asdf3', author: 'qwer3'},
    ],
    selectedReply: null
};
let replyList = [
    {id: 1, content: 'asdf1', author: 'qwer1'},
    {id: 2, content: 'asdf2', author: 'qwer2'},
    {id: 3, content: 'asdf3', author: 'qwer3'},
];
//        getReplies: (commentId) => dispatch(actionCreators.getReplies(commentId)),
//        onEditReply: (reply) => dispatch(actionCreators.editReply(reply)),
//        onDeleteReply: (reply) => dispatch(actionCreators.deleteReply(reply)),
//        addReply: (reply) => dispatch(actionCreators.addReply(reply)),

const mockStore = getMockStore(stubInitialState);

describe('<Replies />', () => {

    let replies, spyGetReplies, spyEditReply, spyDeleteReply, spyAddReply;
    beforeEach(() => {  
        replies = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                <Switch>
                    <Route path='/' render = {() => <Replies replies={replyList} />} />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
        spyGetReplies = jest.spyOn(actionCreators, 'getReplies')
        .mockImplementation(() => { return dispatch => {}; });
        spyEditReply = jest.spyOn(actionCreators, 'editReply')
        .mockImplementation(() => { return dispatch => {}; });
        spyDeleteReply = jest.spyOn(actionCreators, 'deleteReply')
        .mockImplementation(() => { return dispatch => {}; });
        spyAddReply = jest.spyOn(actionCreators, 'addReply')
        .mockImplementation(() => { return dispatch => {}; });
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it(`should render replies`, () => {
        const component = mount(replies);
        let wrapper = component.find('.spyReply');
        expect(wrapper.length).toBe(3);
        expect(spyGetReplies).toHaveBeenCalledTimes(0);
    });

    it(`should set state input properly`, () => {
        const content = 'TEST_CONTENT'
        const component = mount(replies);
        let wrapper = component.find('.reply-content-input');
        wrapper.simulate('change', { target: { value: content } });
        let newRepliesInstance = component.find(Replies.WrappedComponent).instance();
        expect(newRepliesInstance.state.content).toEqual(content);
    });

    it(`should add reply`, () => {
        const component = mount(replies);
        const content = 'TEST_CONTENT'
        let wrapper = component.find('.reply-content-input');
        wrapper.simulate('change', { target: { value: content } });
        wrapper = component.find('.create-reply-button');
        wrapper.simulate('click');
        expect(spyAddReply).toHaveBeenCalledTimes(1);
    });

    it(`should edit reply`, () => {
        const component = mount(replies);
        let wrapper = component.find('.spyReplyEdit');
        wrapper.at(0).simulate('click');
        expect(spyEditReply).toHaveBeenCalledTimes(1);
    });
    
    it(`should delete reply`, () => {
        const component = mount(replies);
        let wrapper = component.find('.spyReplyDelete');
        wrapper.at(0).simulate('click');
        expect(spyDeleteReply).toHaveBeenCalledTimes(1);
    });
  
});