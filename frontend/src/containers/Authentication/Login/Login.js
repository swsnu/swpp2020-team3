import React, {Component} from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { withRouter } from 'react-router-dom'

//Local imports
import * as actionCreators from '../../../store/actions/index';


//TODO:
//should connect to store
class Login extends Component{
    state = {
        id: "",
        password: "",
    }
    onClickSubmit(){
        //this.props.onSignup
        var userCredentials = this.state;
        var tempuserCredentials = {"username": userCredentials.id, "password": userCredentials.password} // this shouldn't be here
        userCredentials = tempuserCredentials; // this shouldn't be here
        console.log(userCredentials)
        this.props.onLogin(userCredentials)
    }
    render(){
        return(
            <div className="Login">
                <form className="Login" >
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

const mapStateToProps = state => {
    return {
       
    };
}
  
const mapDispatchToProps = dispatch => {
    return {
        onLogin: (userCredentials) => dispatch(actionCreators.signIn(userCredentials)),
        }
    }




export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Login));
