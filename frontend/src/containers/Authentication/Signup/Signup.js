import React, {Component} from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { NavLink } from 'react-router-dom';
//Local imports

class Signup extends Component{
    state = {
        name: "",
        id: "",
        email: "",
        password: "",
        password_confirm: ""
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
                    <label>Name</label>
                    <input type="text" name="name" onChange={(event) => this.setState({name: event.target.value})}></input>
                    <label>ID</label>
                    <input type="text" name="id" onChange={(event) => this.setState({id: event.target.value})}></input>
                    <label>Email</label>
                    <input type="text" name="email" onChange={(event) => this.setState({text: event.target.value})}></input>
                    <label>Password</label>
                    <input type="text" name="password" onChange={(event) => this.setState({password: event.target.value})}></input>
                    <label>Confirm password</label>
                    <input type="text" name="password-confirm" onChange={(event) => this.setState({password_confirm: event.target.value})}></input>
                </form>
                <button onClick={()=>this.onClickSubmit()}>Submit</button>
            </div>
        )
    }
}

export default Signup;