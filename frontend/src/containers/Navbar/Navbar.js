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
        this.props.history.push('/search')
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
                    <li><NavLink to='/login' exact>Login</NavLink></li>
                    <li><NavLink to='/signup' exact>Sign Up</NavLink></li>
                    <li><NavLink to='/create' exact>Create</NavLink></li>
                </ul>
                <div className='SearchBar'>
                    <div className= 'searchbar'> <input type='text' value = {this.state.minPrice} onClick={() => this.minPriceClickHandler()} 
                    onBlur = { (e) => this.state.minPrice == '' && this.setState({minPrice : '하한'}) } onChange={(event) =>  this.setState({minPrice: event.target.value})}/></div>
                    <div className= 'searchbar'>~</div>  
                    <div className= 'searchbar'><input type='text' value = {this.state.maxPrice} 
                    onBlur = { (e) => this.state.maxPrice == '' && this.setState({maxPrice : '상한'}) } onClick={() => this.maxPriceClickHandler()} onChange={(event) =>  this.setState({maxPrice: event.target.value})}/></div> 
                    <div className= 'searchbar'><input type='text' value = {this.state.keyword} 
                    onBlur = { (e) => this.state.keyword == '' && this.setState({keyword : '키워드'})} onClick={() => this.keywordClickHandler()} onChange={(event) =>  this.setState({keyword: event.target.value})}/></div> 
                    <div className= 'searchbar'><img className = 'Search_Confirm' onClick={() => this.searchConfirmHandler()} src={require('../../Image/Search_Confirm.png')}/></div>
                </div>
            </div>
        )        
    }
};

export default Navbar;
