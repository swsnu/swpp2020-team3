//React imports
import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';

//Local imports:
import './App.css';
import Mainpage from './containers/Mainpage/Mainpage';
import Detailpage from './containers/detailpage/Detailpage'
import Navbar from './containers/Navbar/Navbar';
import Createpage from './containers/Createpage/Createpage';

function App(props) {
  return(
    <BrowserRouter history={props.history}>
      <div className="App">
        <Navbar history={props.history}/>
        <Switch>
          <Route path='/main-page' exact render={() => <Mainpage history={props.history}/>} />
          <Route path='/create' exact render={()=> <Createpage history={props.history}/>} />
          <Redirect from='/' exact to='/main-page'/>
          <Route render = {() => <h1>Not Found</h1>} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
