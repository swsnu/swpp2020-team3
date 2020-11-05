import React, {Component} from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { withRouter } from 'react-router-dom'
import './Login.css'
//Local imports
import * as actionCreators from '../../../store/actions/index';


//TODO:
//should connect to store
class Login extends Component{
    state = {
        id: "아이디",
        password: "비밀번호",
    }
    onClickId(){
        if (this.state.id == '아이디') {
            this.setState({id : ''})
        }
    }
    onClickPassword(){
        if (this.state.password == '비밀번호') {
            this.setState({password : ''})
        }
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
            <div className = 'LoginBackground'>
                <div className="Login">
                    <form className="Login" >
                        <label>RECIPICK</label>
                        <input type="text" name="id" value = {this.state.id}  onBlur = { (e) => this.state.id == '' && this.setState({id : '아이디'}) } 
                        onClick = {() => this.onClickId()} onChange={(event) => this.setState({id: event.target.value})}></input>
                        <input type="text" name="password" value = {this.state.password} onBlur = { (e) => this.state.password == '' && this.setState({password : '비밀번호'}) }
                        onClick = {() => this.onClickPassword()} onChange={(event) => this.setState({password: event.target.value})}></input>
                        <button className="LoginButton" onClick={()=>this.onClickSubmit()}>로그인</button>
                    </form>
                </div>
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
