import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';
import './Login.css'
//Local imports
import * as actionCreators from '../../../store/actions/index';


//TODO:
//should connect to store
class Login extends Component{
    componentDidMount() {
        this.props.isLogin().then(res => {
            if(res.login_id){
                this.props.history.push('/main-page')
            }
        })
        this.setState({id: 'id', password: 'password'})
    }

    onClickSubmit(){
        //this.props.onSignup
        var userCredentials = this.state;
        var tempuserCredentials = {"username": userCredentials.id, "password": userCredentials.password} // this shouldn't be here
        userCredentials = tempuserCredentials; // this shouldn't be here
        this.props.onLogin(userCredentials).then((res) => {
            if(res){
                window.history.back();
                this.props.isLogin();
            }
            else {
                alert("Wrong username or password!");
            } 
        })
    }
    render(){
        return(
            <div className = 'LoginBackground'>
                <div className="Login">
                    <div className="Login" >
                        <label>RECIPICK</label>
                        <input type="text" name="id"  placeholder = "아이디" onChange={(event) => this.setState({id: event.target.value})}></input>
                        <input type="text" name="password" placeholder = "비밀번호" onChange={(event) => this.setState({password: event.target.value})} type="password"></input>
                        <button className="LoginButton" onClick={()=>this.onClickSubmit()}>로그인</button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        is_authenticated: state.user.is_authenticated
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onLogin: (userCredentials) => dispatch(actionCreators.signIn(userCredentials)),
        isLogin: () => dispatch(actionCreators.isLogin())
        }
    }

Login.propTypes = {
    onLogin: PropTypes.func,
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Login));
