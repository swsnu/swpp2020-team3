//React imports
import React from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'connected-react-router';
import PropTypes from "prop-types";

//Local imports:
import './App.css';
import Mainpage from './containers/Mainpage/Mainpage';
import RecipeList from './containers/RecipeList/RecipeList'
import Detailpage from './containers/detailpage/Detailpage'
import MyPage from './containers/MyPage/MyPage'
import Navbar from './containers/Navbar/Navbar';
import Createpage from './containers/Createpage/Createpage';
import Signup from './containers/Authentication/Signup/Signup';
import Login from './containers/Authentication/Login/Login';
import Editpage from './containers/Editpage/Editpage';
import Mealplanner from './containers/Mealplanner/Mealplanner';

function App(props) {
  return(
    <ConnectedRouter history={props.history}>
      <Router>
      <div className="App">
        <Navbar history={props.history}/>
        <Switch>
          <Route path='/search' component={RecipeList} />
          <Route path='/main-page' exact render={() => <Mainpage history={props.history}/>} />
          <Route path='/detail-page/:id' exact render={() => <Detailpage history={props.history}/>}/>
          <Route path='/edit/:id' exact render={() => <Editpage history={props.history}/>}/>
          <Route path='/create' exact render={()=> <Createpage history={props.history}/>} />
          <Route path='/signup' exact render={() => <Signup history={props.history} />} />
          <Route path='/login' exact render={() => <Login history={props.history} />} />
          <Route path='/meal-planner' exact render={() => <Mealplanner history={props.history} />} />
          <Route path='/user/:id' exact render={() => <MyPage history={props.history} />} />
          <Redirect from='/' exact to='/main-page'/>
          <Route render = {() => <h1>Not Found</h1>} />
        </Switch>
      </div>
      </Router>
    </ConnectedRouter>
  );
}
App.propTypes = {
  history: PropTypes.object
};
export default App;
