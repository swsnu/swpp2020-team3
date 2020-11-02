import React, {Component} from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { withRouter } from 'react-router-dom'
//Local imports
import * as actionCreators from '../../../store/actions/index';

//TODO:
//should connect to store
class Signup extends Component{
    state = {
        name: "",
        id: "",
        email: "",
        password: "",
        password_confirm: ""
    }
    onClickSubmit(){
        //this should be the one --> discuss
        var userCredentials = this.state;
        var tempuserCredentials = {"username": userCredentials.name, "password": userCredentials.password} // this shouldn't be here
        userCredentials = tempuserCredentials; // this shouldn't be here
        console.log(userCredentials)
        this.props.onSignup(userCredentials)
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


const mapStateToProps = state => {
    return {
       
    };
}
  
const mapDispatchToProps = dispatch => {
    return {
        onSignup: (userCredentials) => dispatch(actionCreators.signUp(userCredentials)),
        }
    }

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Signup));