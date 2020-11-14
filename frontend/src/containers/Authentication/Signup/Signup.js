import React, {Component} from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { withRouter } from 'react-router-dom'
//Local imports
import * as actionCreators from '../../../store/actions/index';
import './Signup.css'
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
        this.props.onSignup(userCredentials)
    }
    render(){
        return(
            <div className = 'SignupBackground'>
                <div className="Signup">
                    <form className="Signup" >
                        <p> RECIPICK </p>
                        <label>이름</label>
                        <input type="text" name="name" onChange={(event) => this.setState({name: event.target.value})}></input>
                        <label>비밀번호</label>
                        <input type="text" name="id" onChange={(event) => this.setState({id: event.target.value})}></input>
                        <label>이메일</label>
                        <input type="text" name="email" onChange={(event) => this.setState({email: event.target.value})}></input>
                        <label>비밀번호</label>
                        <input type="text" name="password" onChange={(event) => this.setState({password: event.target.value})}></input>
                        <label>비밀번호 재확인</label>
                        <input type="text" name="password_confirm" onChange={(event) => this.setState({password_confirm: event.target.value})}></input>
                    </form>
                    <button className = "SignupButton" onClick={()=>this.onClickSubmit()}>가입하기</button>
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
        onSignup: (userCredentials) => dispatch(actionCreators.signUp(userCredentials)),
        }
    }

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Signup));