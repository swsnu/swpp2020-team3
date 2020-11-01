import React, {Component} from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { withRouter } from 'react-router-dom'

//Local imports


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
        console.log(userCredentials)
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

// const mapStateToProps = state => {
//     return {
       
//     };
// }
  
// const mapDispatchToProps = dispatch => {
//     return {
//         onLogin: (userCredentials) => dispatch(actionCreators.onLogin(userCredentials)),

//         }
//     }




//export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Login));
export default (withRouter(Login));