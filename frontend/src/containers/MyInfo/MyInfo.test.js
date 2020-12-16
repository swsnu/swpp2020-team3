import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';

import MyInfo from './MyInfo';
import { getMockStore } from '../../test-utils/mocks';
import { history } from '../../store/store';
import * as actionCreators from '../../store/actions/userCreators';



const stubInitialState = {
  
};
const mockStore = getMockStore(stubInitialState);

describe('<MyInfo />', () => {
    let myInfo, spyChangePassword;
    beforeEach(() => {  
        myInfo = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                <Switch>
                    <Route path='/' component = {MyInfo} />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
        spyChangePassword = jest.spyOn(actionCreators, 'changePassword')
        .mockImplementation(() => { return () => {}; });
    });

    afterEach(() => {
      jest.clearAllMocks();
    })

    it(`should set state properly on given inputs(password, confirm)`, () => {
        const password = 'PASSWORD', password_confirm = 'PASSWORD_CONFIRM';
        const component = mount(myInfo);
        let wrapper;
        wrapper = component.find('.new_password');
        wrapper.simulate('change', { target: { value: password } });
        wrapper = component.find('.password_confirm');
        wrapper.simulate('change', { target: { value: password_confirm } });
        let newMyInfoInstance = component.find(MyInfo.WrappedComponent).instance();
        expect(newMyInfoInstance.state.new_password).toEqual(password);
        expect(newMyInfoInstance.state.password_confirm).toEqual(password_confirm);
    });
    
    it(`should call 'changePasswordHandler'`, () => {
      const password = 'PASSWORD', password_confirm = 'PASSWORD_CONFIRM';
      const component = mount(myInfo);
      let wrapper;
      wrapper = component.find('.new_password');
      wrapper.simulate('change', { target: { value: password } });
      wrapper = component.find('.password_confirm');
      wrapper.simulate('change', { target: { value: password_confirm } });
      wrapper = component.find('.changePassword');
      wrapper.simulate('click');
      expect(spyChangePassword).toHaveBeenCalledTimes(0);
      wrapper = component.find('.password_confirm');
      wrapper.simulate('change', { target: { value: password } });
      wrapper = component.find('.changePassword');
      wrapper.simulate('click');
      expect(spyChangePassword).toHaveBeenCalledTimes(1);
    });

});