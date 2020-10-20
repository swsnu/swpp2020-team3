//React imports
import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';

//Local imports:
import './App.css';
import Mainpage from './containers/Mainpage/Mainpage';
import Navbar from './containers/Navbar/Navbar';

function App() {
  return(
    <BrowserRouter>
      <div className="App">
        <Navbar/>
        <Switch>
          <Route path='/main-page' exact render={() => <Mainpage/>} />
          <Redirect from='/' exact to='/main-page'/>
          <Route render = {() => <h1>Not Found</h1>} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
