import React, {Component} from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { NavLink } from 'react-router-dom';
//Local imports
import './Navbar.css'
import Createpage from '../Createpage/Createpage';

class Navbar extends Component{
    state = {
        minPrice : '',
        maxPrice : '',
        keyword : '',
    }

    searchConfirmHandler = () => {
        this.props.history.push(`/search?category1=true&category2=true&category3=true&category4=true&category5=true&category6=true&minPrice=${this.state.minPrice == '' ? 0 : this.state.minPrice}&maxPrice=${this.state.maxPrice == '' ? Number.MAX_SAFE_INTEGER : this.state.maxPrice}&minDuration=0&maxDuration=${Number.MAX_SAFE_INTEGER}&searchWord=${this.state.keyword}&pageStart=0&pageNumber=1&searchMode='likes'&searchOptionsClicked=false`);
        window.location.reload();
    }

    render(){
        return(
            <div className = 'NavBar'>
                <ul className = 'NavBar'>
                    <logo> <NavLink to='/main-page' exact><img className='Logo' src={require('../../Image/LOGO.png')}/></NavLink> </logo>
                    <li> <NavLink to='/main-page' exact>중식</NavLink> </li>
                    <li> <NavLink to='/main-page' exact>한식</NavLink> </li>
                    <li> <NavLink to='/main-page' exact>양식</NavLink> </li>
                    <li><NavLink to='/main-page' exact>??게시판??</NavLink></li>
                    <li id = 'lilogin'><NavLink to='/login' exact>Login</NavLink></li>
                    <li id = 'lisign'><NavLink to='/signup' exact>Sign Up</NavLink></li>
                    <li><NavLink to='/create' exact>Create</NavLink></li>
                </ul>
                <div className='SearchBar'>
                    <div className= 'searchbar'> <input type='text' placeholder = "하한" value = {this.state.minPrice}  onChange={(event) =>  this.setState({minPrice: event.target.value})}/></div>
                    <div className= 'searchbar'>~</div>  
                    <div className= 'searchbar'><input type='text'  placeholder = "상한" value = {this.state.maxPrice}  onChange={(event) =>  this.setState({maxPrice: event.target.value})}/></div> 
                    <div className= 'searchbar'><input type='text'  placeholder = "키워드" value = {this.state.keyword}  onChange={(event) =>  this.setState({keyword: event.target.value})}/></div> 
                    <div className= 'searchbar'><img className = 'Search_Confirm' onClick={() => this.searchConfirmHandler()} src={require('../../Image/Search_Confirm.png')}/></div>
                </div>
            </div>
        )        
    }
};

export default Navbar;
