import Enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import 'core-js/stable';
Enzyme.configure({
adapter: new EnzymeAdapter(),
disableLifecycleMethods: true
})
