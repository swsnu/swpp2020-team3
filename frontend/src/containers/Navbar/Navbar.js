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
        this.props.history.push(`/search?category1=true&category2=true&category3=true&category4=true&category5=true&category6=true&minPrice=${this.state.minPrice == '' ? 0 : this.state.minPrice}&maxPrice=${this.state.maxPrice == '' ? 100000 : this.state.maxPrice}&minDuration=0&maxDuration=${100}&searchWord=${this.state.keyword}&pageStart=0&pageNumber=1&searchMode='likes'&searchOptionsClicked=false`);
        window.location.reload();
    }

    render(){
        return(
            <div className = 'BackNavBar'>
                <div className='SearchBar'>
                    <logo> <NavLink to='/main-page' exact><p id = 'Logo'>RECIPICK</p></NavLink> </logo>
                    <div className= 'searchbar'> <input type='text' placeholder = "하한" value = {this.state.minPrice}  onChange={(event) =>  this.setState({minPrice: event.target.value})}/></div>
                    <div className= 'searchbar'>~</div>  
                    <div className= 'searchbar'><input type='text'  placeholder = "상한" value = {this.state.maxPrice}  onChange={(event) =>  this.setState({maxPrice: event.target.value})}/></div> 
                    <div className= 'searchbar'><input type='text'  placeholder = "키워드" value = {this.state.keyword}  onChange={(event) =>  this.setState({keyword: event.target.value})}/></div> 
                    <div className= 'searchbar'><img className = 'Search_Confirm' onClick={() => this.searchConfirmHandler()} src={require('../../Image/Search_Confirm.png')}/></div>
                    <div id = 'subblock'> 
                    <li id = 'lilogin'><NavLink to='/login' exact>Login</NavLink></li>
                    <li id = 'lisign'><NavLink to='/signup' exact>Sign Up</NavLink></li>
                    <li id = 'licreate'><NavLink to='/create' exact>Create</NavLink></li>
                    </div>
                </div>
                <ul id = 'Navlist'>
                    <li> <a onClick={() => {this.props.history.push(`/search?category1=false&category2=false&category3=true&category4=false&category5=false&category6=false
                                &minPrice=${this.state.minPrice == '' ? 0 : this.state.minPrice}
                                &maxPrice=${this.state.maxPrice == '' ? 100000 : this.state.maxPrice}
                                &minDuration=0&maxDuration=${100}&searchWord=${this.state.keyword}
                                &pageStart=0&pageNumber=1&searchMode='likes'&searchOptionsClicked=false`)
                                window.location.reload()
                                }}> 중식 </a>
                    </li>
                    <li> <a onClick={() => {this.props.history.push(`/search?category1=false&category2=true&category3=false&category4=false&category5=false&category6=false
                                &minPrice=${this.state.minPrice == '' ? 0 : this.state.minPrice}
                                &maxPrice=${this.state.maxPrice == '' ? 100000 : this.state.maxPrice}
                                &minDuration=0&maxDuration=${100}&searchWord=${this.state.keyword}
                                &pageStart=0&pageNumber=1&searchMode='likes'&searchOptionsClicked=false`)
                                window.location.reload()
                                }}> 한식 </a>
                    </li>
                    <li> <a onClick={() => {this.props.history.push(`/search?category1=true&category2=false&category3=false&category4=false&category5=false&category6=false
                                &minPrice=${this.state.minPrice == '' ? 0 : this.state.minPrice}
                                &maxPrice=${this.state.maxPrice == '' ? 100000 : this.state.maxPrice}
                                &minDuration=0&maxDuration=${100}&searchWord=${this.state.keyword}
                                &pageStart=0&pageNumber=1&searchMode='likes'&searchOptionsClicked=false`)
                                window.location.reload()
                                }}> 양식 </a>
                    </li>
                    <li> <a onClick={() => {this.props.history.push(`/search?category1=false&category2=false&category3=false&category4=true&category5=false&category6=false
                                &minPrice=${this.state.minPrice == '' ? 0 : this.state.minPrice}
                                &maxPrice=${this.state.maxPrice == '' ? 100000 : this.state.maxPrice}
                                &minDuration=0&maxDuration=${100}&searchWord=${this.state.keyword}
                                &pageStart=0&pageNumber=1&searchMode='likes'&searchOptionsClicked=false`)
                                window.location.reload()
                                }}> 일식 </a>
                    </li>
                    <li> <a onClick={() => {this.props.history.push(`/search?category1=false&category2=false&category3=false&category4=false&category6=true&category5=false
                                &minPrice=${this.state.minPrice == '' ? 0 : this.state.minPrice}
                                &maxPrice=${this.state.maxPrice == '' ? 100000 : this.state.maxPrice}
                                &minDuration=0&maxDuration=${100}&searchWord=${this.state.keyword}
                                &pageStart=0&pageNumber=1&searchMode='likes'&searchOptionsClicked=false`)
                                window.location.reload()
                                }}> 디저트 </a>
                    </li>
                    <li> <a onClick={() => {this.props.history.push(`/search?category1=false&category2=false&category3=false&category4=false&category5=true&category6=false
                                &minPrice=${this.state.minPrice == '' ? 0 : this.state.minPrice}
                                &maxPrice=${this.state.maxPrice == '' ? 100000 : this.state.maxPrice}
                                &minDuration=0&maxDuration=${100}&searchWord=${this.state.keyword}
                                &pageStart=0&pageNumber=1&searchMode='likes'&searchOptionsClicked=false`)
                                window.location.reload()
                                }}> 편의점 </a>
                    </li>
                </ul>
            </div>
        )        
    }
};

export default Navbar;
