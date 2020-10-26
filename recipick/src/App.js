//React imports
import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';

//Local imports:
import './App.css';
import Mainpage from './containers/Mainpage/Mainpage';
import RecipeList from './containers/RecipeList/RecipeList'
import Navbar from './containers/Navbar/Navbar';

function App(props) {
  return(
    <BrowserRouter history={props.history}>
      <div className="App">
        <Navbar history={props.history}/>
        <Switch>
          <Route path='/search' exact component={RecipeList} />
          <Route path='/main-page' exact render={() => <Mainpage history={props.history}/>} />
          <Redirect from='/' exact to='/main-page'/>
          <Route render = {() => <h1>Not Found</h1>} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
