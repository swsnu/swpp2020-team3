import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';
import './MyInfo.css'
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
            <div className = 'Info'>
                <div className="MInfo">
                    <form className="MyInfo">
                        <div className = "username">
                        <p id='infolabel'>Username</p>
                        {'\u00A0'.repeat(33)+this.props.username}
                        </div>
                        <div  className = "email">
                        <p id='infolabel'>email</p>
                        {'\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'+this.props.email}
                        </div>
                        <p id='infolabel'>new password</p>
                        {'\u00A0'.repeat(26)}
                        <input className="new_password" type="password" placeholder = "새 비밀번호" onChange={(event) => this.setState({new_password: event.target.value})}></input>
                        <br/>
                        <p id='infolabel' >new password(confirm)</p>
                        {'\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'}
                        <input className="password_confirm" type="password" placeholder = "비밀번호 확인" onChange={(event) => this.setState({password_confirm: event.target.value})}></input>
                        <br/>
                        <button className="changePassword" disabled = {!this.state.new_password || !this.state.password_confirm} onClick={()=>this.onClickSubmit()}>저장</button>
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
