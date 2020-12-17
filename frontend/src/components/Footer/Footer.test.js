import React from 'react';
import { shallow } from 'enzyme';
import Footer from './Footer';

describe('Footer', () => {
  // let footer //, spyOnGetRecipe;
    // beforeEach(() => {
    //   footer = (
    //     <Provider store={mockStore}>
    //       <Router history={history}>
    //           <Footer/>
    //       </Router>
    //     </Provider>
    //   );
    // })

    it('should render Footer', () =>{
      const component = shallow(<Footer/>)
      const wrapper = component.find('.Footer'); 
      expect(wrapper.length).toBe(1);
    })

})