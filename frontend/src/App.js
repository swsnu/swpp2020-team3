//React imports
import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

//Local imports:
import './App.css';
import Mainpage from './containers/Mainpage/Mainpage';
import RecipeList from './containers/RecipeList/RecipeList'
import Detailpage from './containers/detailpage/Detailpage'
import Navbar from './containers/Navbar/Navbar';
import Createpage from './containers/Createpage/Createpage';

function App(props) {
  return(
    <ConnectedRouter history={props.history}>
      <div className="App">
        <Navbar history={props.history}/>
        <Switch>
          <Route path='/search' exact component={RecipeList} />
          <Route path='/main-page' exact render={() => <Mainpage history={props.history}/>} />
          <Route path='/detail-page' exact render={() => <Detailpage history={props.history}/>}/>
          <Route path='/create' exact render={()=> <Createpage history={props.history}/>} />
          <Redirect from='/' exact to='/main-page'/>
          <Route render = {() => <h1>Not Found</h1>} />
        </Switch>
      </div>
    </ConnectedRouter>
  );
}

export default App;
