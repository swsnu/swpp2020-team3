import React, {Component} from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { NavLink } from 'react-router-dom';
import './Navbar.css'

class Navbar extends Component{
    state = {
        minPrice : '하한',
        maxPrice : '상한',
        keyword : '키워드',
    }

    maxPriceClickHandler = () => {
        if(this.state.maxPrice == '상한'){
            this.setState({maxPrice: ''})
        }
    }

    minPriceClickHandler = () => {
        if(this.state.minPrice == '하한'){
            this.setState({minPrice: ''})
        }
    }

    keywordClickHandler = () => {
        if(this.state.keyword == '키워드'){
            this.setState({keyword: ''})
        }
    }

    searchConfirmHandler = () => {
        this.props.history.push('/recipe-list')
    }

    render(){
        return(
            <div>
                <ul>
                    <logo> <NavLink to='/main-page' exact><img className='Logo' src={require('../../Image/LOGO.png')}/></NavLink> </logo>
                    <li> <NavLink to='/main-page' exact>중식</NavLink> </li>
                    <li> <NavLink to='/main-page' exact>한식</NavLink> </li>
                    <li> <NavLink to='/main-page' exact>양식</NavLink> </li>
                    <li><NavLink to='/main-page' exact>??게시판??</NavLink></li>
                    <li><NavLink to='/main-page' exact>Login</NavLink></li>
                    <li><NavLink to='/main-page' exact>Sign Up</NavLink></li>
                </ul>
                <dl>
                    <searchbar> <input type='text' value = {this.state.minPrice} onClick={() => this.minPriceClickHandler()} onChange={(event) =>  this.setState({minPrice: event.target.value})}/></searchbar>
                    <searchbar>~</searchbar>  
                    <searchbar><input type='text' value = {this.state.maxPrice} onClick={() => this.maxPriceClickHandler()} onChange={(event) =>  this.setState({maxPrice: event.target.value})}/></searchbar> 
                    <searchbar><input type='text' value = {this.state.keyword} onClick={() => this.keywordClickHandler()} onChange={(event) =>  this.setState({keyword: event.target.value})}/></searchbar> 
                    <searchbar><img className = 'Search_Confirm' onClick={() => this.searchConfirmHandler()} src={require('../../Image/Search_Confirm.png')}/></searchbar>
                </dl>
            </div>
        )        
    }
};

export default Navbar;
