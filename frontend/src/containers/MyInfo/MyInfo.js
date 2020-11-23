import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';
//import './Login.css'
//Local imports
import * as actionCreators from '../../store/actions/index';


//TODO:
//should connect to store
class MyInfo extends Component{
    state = {
        new_password: "",
        password_confirm: "",
    }

    onClickSubmit(){
        
        if(this.state.new_password == this.state.password_confirm){
            var userCredentials = {"id": this.props.id, "new_password": this.state.new_password}; // this shouldn't be here
            this.props.onChangePassword(userCredentials);
        }
        else{
            window.prompt("two passwords are not equal!");
        }   
    }
    render(){
        return(
            <div className = 'MyInfo'>
                <div className="MyInfo">
                    <form className="MyInfo">
                        <p>Username</p>
                        <div className = "username">
                        {this.props.username}
                        </div>
                        <p>first name</p>
                        <div className = "first_name">
                        {this.props.first_name}
                        </div>
                        <p>last name</p>
                        <div className = "last_name">
                        {this.props.last_name}
                        </div>
                        <p>email</p>
                        <div className = "email">
                        {this.props.email}
                        </div>
                        <p>new password</p>
                        <input type="text" name="new_password"  placeholder = "새 비밀번호" onChange={(event) => this.setState({new_password: event.target.value})}></input>
                        <p>new password(confirm)</p>
                        <input type="text" name="password_confirm" placeholder = "비밀번호 확인" onChange={(event) => this.setState({password_confirm: event.target.value})}></input>
                        <button className="changePassword" disabled = {!this.state.new_password || !this.state.password_confirm} onClick={()=>this.onClickSubmit()}>비밀번호 변경</button>
                    </form>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onChangePassword: (userCredentials) => dispatch(actionCreators.changePassword(userCredentials)),
        }
    }

MyInfo.propTypes = {
    onChangePassword: PropTypes.func,
}

export default connect(null,mapDispatchToProps)(withRouter(MyInfo));
