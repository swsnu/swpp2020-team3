import React, {Component} from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { NavLink } from 'react-router-dom';
//Local imports

class Login extends Component{
    state = {
        id: "",
        password: "",
    }
    onClickSubmit(){
        //this.props.onSignup
        var userCredentials = this.state;
        console.log(userCredentials)
    }
    render(){
        return(
            <div className="Signup">
                <form className="Signup" >
                    <label>ID</label>
                    <input type="text" name="id" onChange={(event) => this.setState({id: event.target.value})}></input>
                    <label>Password</label>
                    <input type="text" name="password" onChange={(event) => this.setState({password: event.target.value})}></input>
                </form>
                <button onClick={()=>this.onClickSubmit()}>Submit</button>
            </div>
        )
    }
}

export default Login;