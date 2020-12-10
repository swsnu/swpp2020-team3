import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';
//Local imports
import * as actionCreators from '../../../store/actions/index';
import './Signup.css'
//TODO:
//should connect to store
class Signup extends Component{
    state = {
        name: "name",
        id: "id",
        email: "",
        password: "",
        password_confirm: "",
        loading: false
    }
    onClickSubmit(){
        //this should be the one --> discuss
        var userCredentials = this.state;
        if(userCredentials.password!=userCredentials.password_confirm){
            window.alert('Recheck password!')
        }
        else {
            var tempuserCredentials = {"username": userCredentials.name, "password": userCredentials.password, "email": userCredentials.email} // this shouldn't be here
            userCredentials = tempuserCredentials; // this shouldn't be here
            this.props.onSignup(userCredentials).then(res => {
                if(res){
                    window.alert('Check your mail to activate your accont!');
                    this.props.history.push('/main-page');
                }
                else{
                    window.alert('This username is already used!');
                }
            })
        }
        
    }
    render(){
        return(
            <div className = 'SignupBackground'>
                <div className="Signup">
                    <form className="Signup" >
                        <p> RECIPICK </p>
                        <label>이름</label>
                        <input type="text" name="name" onChange={(event) => this.setState({name: event.target.value})}></input>
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
  
const mapDispatchToProps = dispatch => {
    return {
        onSignup: (userCredentials) => dispatch(actionCreators.signUp(userCredentials)),
        }
}

Signup.propTypes = {
    onSignup: PropTypes.func,
}

export default connect(null,mapDispatchToProps)(withRouter(Signup));