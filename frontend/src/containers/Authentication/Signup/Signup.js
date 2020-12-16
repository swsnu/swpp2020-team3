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

    componentDidMount() {
        this.props.isLogin().then(res => {
            if(res.login_id){
                this.props.history.push('/main-page')
            }
        })
        this.setState({id: 'id', password: 'password'})
    }

    validate = (email) => {
        const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        return re.test(email);
    }

    onClickSubmit(){
        //this should be the one --> discuss
        var userCredentials = this.state;
        if(userCredentials.password!=userCredentials.password_confirm){
            window.alert('Recheck password!');
        }
        else if(!this.validate(userCredentials.email)){
            window.alert('Email is not valid. Recheck email!');
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
                        <label>닉네임</label>
                        <input type="text" name="name" onChange={(event) => this.setState({name: event.target.value})}></input>
                        <label>이메일</label>
                        <input type="text" name="email" onChange={(event) => this.setState({email: event.target.value})}></input>
                        <label>비밀번호</label>
                        <input type="text" name="password" type="password" onChange={(event) => this.setState({password: event.target.value})}></input>
                        <label>비밀번호 재확인</label>
                        <input type="text" name="password_confirm" type="password" onChange={(event) => this.setState({password_confirm: event.target.value})}></input>
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
        isLogin: () => dispatch(actionCreators.isLogin()),
        }
}

Signup.propTypes = {
    onSignup: PropTypes.func,
}

export default connect(null,mapDispatchToProps)(withRouter(Signup));
