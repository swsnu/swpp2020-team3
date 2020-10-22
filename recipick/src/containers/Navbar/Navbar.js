import React, {Component} from 'react';
import './Navbar.css'
class Navbar extends Component{
    render(){
        return(
            <div>
                <ul>
                    <li>LOGO</li>
                    <li>중식</li>
                    <li>한식</li>
                    <li>양식</li>
                    <li>??게시판??</li>
                    <li>Login</li>
                    <li>Sign up</li>
                </ul>
            </div>
        )        
    }
};

export default Navbar;
