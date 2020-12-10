import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import { getMockStore } from '../../test-utils/mocks';
import { history } from '../../store/store';
import * as actionCreators from '../../store/actions/reply';
import Replies from './Replies';
import * as UserCreators from '../../store/actions/userCreators';

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

    let replies, spyGetReplies, spyEditReply, spyDeleteReply, spyAddReply, spyIsLogin;
    let spyConfirm = jest.spyOn(window, 'confirm')
        .mockImplementation(() => true)
    const fflushPromises = () => {
        return new Promise(resolve => setImmediate(resolve));
    }

    beforeEach(() => {  
        replies = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                     <Replies history={history} replies={replyList} />
                </ConnectedRouter>
            </Provider>
        );
        spyGetReplies = jest.spyOn(actionCreators, 'getReplies')
        .mockImplementation(() => { return () => {}; });
        spyEditReply = jest.spyOn(actionCreators, 'editReply')
        .mockImplementation(() => { return () => {}; });
        spyDeleteReply = jest.spyOn(actionCreators, 'deleteReply')
        .mockImplementation(() => { return () => {}; });
        spyAddReply = jest.spyOn(actionCreators, 'addReply')
        .mockImplementation(() => { return () => {}; });
        
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

    it(`should add reply`, async () => {
        spyIsLogin = jest.spyOn(UserCreators, 'isLogin')
        .mockImplementation(() => {
            return () => new Promise(resolve => {
                const result = {login_id: 1};
                setImmediate(resolve(result))
            })
        })
        const component = mount(replies);
        await fflushPromises();
        const content = 'OOOOOPS'
        let wrapper = component.find('.reply-content-input');
        wrapper.simulate('change', { target: { value: content } });
        wrapper = component.find('.create-reply-button');
        wrapper.simulate('click');
        expect(spyAddReply).toHaveBeenCalledTimes(0);
    });
    
    it(`should add reply2`, () => {
        const spyHistoryPush = jest.spyOn(history, 'push')
        .mockImplementation(() => {});
        spyIsLogin = jest.spyOn(UserCreators, 'isLogin')
        .mockImplementation(() => { return () => {
            return Promise.resolve({login_id: null});
            }; 
        });
        const component = mount(replies);
        const content = 'OOOOOPS'
        let wrapper = component.find('.reply-content-input');
        wrapper.simulate('change', { target: { value: content } });
        wrapper = component.find('.create-reply-button');
        wrapper.simulate('click');
        expect(spyAddReply).toHaveBeenCalledTimes(0);
        expect(spyIsLogin).toHaveBeenCalledTimes(1)
        expect(spyHistoryPush).toHaveBeenCalledTimes(0);
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

    it('should test reply page', () => {
        const manyreplies = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                <Switch>
                    <Route path='/' render = {() => <Replies replies={new Array(30)} />} />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
        const component = mount(manyreplies);
        let wrapper = component.find('.row button');
        wrapper.forEach(button => {
            button.simulate('click');
        })
        wrapper = component.find('.row button').at(0);
        wrapper.simulate('click');
    })

    it('should work handleKeyPress', () => {
        const component = mount(replies);
        const instance = component.find(Replies.WrappedComponent).instance();
        const spyOnAdd = jest.fn();
        instance.onAddReply = spyOnAdd;
        instance.handleKeyPress({key: 'Enter'})
        expect(spyOnAdd).toHaveBeenCalledTimes(0);
        instance.state.content = 'text';
        instance.handleKeyPress({key: 'Enter'})
        expect(spyOnAdd).toHaveBeenCalledTimes(1);

    })

    it('should work confirm', async () => {
        let spyIsLogin = jest.spyOn(UserCreators, 'isLogin')
        .mockImplementation(() => { 
            return () => new Promise(resolve => {
                const result = {login_id: null};
                setImmediate(resolve(result))
            })
        });
        let spyConfirm = jest.spyOn(window, 'confirm')
        .mockImplementation(() => true)

        const component = mount(replies);
        await fflushPromises();
        const instance = component.find(Replies.WrappedComponent).instance();
        instance.onAddReply();
    })

    it('should work neg confirm', async() => {
        let spyIsLogin = jest.spyOn(UserCreators, 'isLogin')
        .mockImplementation(() => { 
            return () => new Promise(resolve => {
                const result = {login_id: null};
                setImmediate(resolve(result))
            })
        });
        let spyConfirm = jest.spyOn(window, 'confirm')
            .mockImplementation(() => false)
        const component = mount(replies);
        fflushPromises();
        const instance = component.find(Replies.WrappedComponent).instance();
        instance.onAddReply();
    })
  
});