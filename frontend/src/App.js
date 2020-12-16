//React imports
import React, { useEffect } from 'react';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'connected-react-router';
import PropTypes from "prop-types";

//Local imports:
import './App.css';
import * as actionCreators from './store/actions/index';
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
import Footer from './components/Footer/Footer'

function App(props) {
  useEffect(() => {
    props.isLogin();
  })
  return(
    <ConnectedRouter history={props.history}>
      <Router>
      <div className="App">
        <Navbar history={props.history}/>
        <Switch>
          {/*{props.is_authenticated==true?<Redirect from='/login' exact to='/main-page'/>:null}
          {props.is_authenticated==false?<Redirect from='/create' exact to='/login'/>:null}*/}
          <Route path='/search' component={RecipeList} />
          <Route path='/main-page' exact render={() => <Mainpage history={props.history}/>} />
          <Route path='/detail-page/:id' exact render={() => <Detailpage history={props.history}/>}/>
          <Route path='/edit/:id' exact render={() => <Editpage history={props.history}/>}/>
          <Route path='/create' exact render={()=> <Createpage history={props.history}/>} />
          <Route path='/signup' exact render={() => <Signup history={props.history} />} />
          <Route path='/login' exact render={() => <Login history={props.history} />} />
          <Route path='/meal-planner' exact render={() => <Mealplanner history={props.history} />} />
          <Route path='/user/:id' component={MyPage} />
          <Redirect from='/' exact to='/main-page'/>
          
          <Route render = {() => <h1>Not Found</h1>} />
        </Switch>
        <Footer />
      </div>
      </Router>
    </ConnectedRouter>
  );
}

const mapStateToProps = (state) => {
  return {
    is_authenticated: state.user.is_authenticated
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    isLogin: () => dispatch(actionCreators.isLogin())
  }
}
App.propTypes = {
  history: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
