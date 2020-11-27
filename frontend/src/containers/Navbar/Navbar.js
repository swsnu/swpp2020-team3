import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
//Local imports
import './Navbar.css'
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import * as actionCreators from '../../store/actions/index';

class Navbar extends Component{
    state = {
        minPrice : '',
        maxPrice : '',
        keyword : '',
    }
    
    componentDidMount() {
        this.props.isLogin()
    }
    searchConfirmHandler = () => {
        let query = {
            American: true, Korean: true,
            Chinese: true, Japanese: true,
            ConvenienceStore: true, Dessert: true,
            minPrice: this.state.minPrice == '' ? 0 : this.state.minPrice,
            maxPrice: this.state.maxPrice == '' ? 100000 : this.state.maxPrice,
            minDuration: 0, maxDuration: 100,
            searchWord: this.state.keyword,
            pageStart: 0, pageNumber: 1,
            searchMode: 'likes', searchOptionsClicked: false,
        }
        this.props.history.push(this.getURL(query));
        window.location.reload();
    }

    clickCategoryHandler = (id) => {
        let query = {
            American: id == 1, Korean: id == 2,
            Chinese: id == 3, Japanese: id == 4,
            ConvenienceStore: id == 5, Dessert: id == 6,
            minPrice: this.state.minPrice == '' ? 0 : this.state.minPrice,
            maxPrice: this.state.maxPrice == '' ? 100000 : this.state.maxPrice,
            minDuration: 0, maxDuration: 100,
            searchWord: this.state.keyword,
            pageStart: 0, pageNumber: 1,
            searchMode: 'likes', searchOptionsClicked: false,
        }
        this.props.history.push(this.getURL(query));
        window.location.reload();
    }

    getURL(st){
        return `/search?American=${st.American}&Korean=${st.Korean}&Chinese=${st.Chinese}&Japanese=${st.Japanese}&ConvenienceStore=${st.ConvenienceStore}&Dessert=${st.Dessert}&minPrice=${st.minPrice}&maxPrice=${st.maxPrice}&minDuration=${st.minDuration}&maxDuration=${st.maxDuration}&searchWord=${st.searchWord}&pageStart=${st.pageStart}&pageNumber=${st.pageNumber}&searchMode=${st.searchMode}&searchOptionsClicked=${st.searchOptionsClicked}`;
    }

    render(){
        return(
            <div className = 'BackNavBar'>
                <div className='SearchBar'>
                    <div id='logo'> <NavLink to='/main-page' exact><p id = 'Logo'>RECIPICK</p></NavLink> </div>
                    <div className= 'searchbar'> <input type='text' placeholder = "하한" value = {this.state.minPrice}  onChange={(event) =>  this.setState({minPrice: event.target.value})}/></div>
                    <div className= 'searchbar' id='wave'>~</div>
                    <div className= 'searchbar'><input type='text'  placeholder = "상한" value = {this.state.maxPrice}  onChange={(event) =>  this.setState({maxPrice: event.target.value})}/></div> 
                    <div className= 'searchbar'><input type='text'  placeholder = "키워드" value = {this.state.keyword}  onChange={(event) =>  this.setState({keyword: event.target.value})}/></div> 
                    <div className= 'searchbar'><img width='27' className = 'Search_Confirm' onClick={() => this.searchConfirmHandler()} src={require('../../Image/Search_Confirm.png')}/></div>
                    <div id = 'subblock'>
                    {!this.props.login_id?<li id = 'lilogin'><NavLink to='/login' exact>Login</NavLink></li>
                    :<li id='lilogout' onClick={() => this.props.onLogout().then(() => this.props.isLogin())}><NavLink to='/main-page' exact>Log out</NavLink></li>}
                    {!this.props.login_id?<li id = 'lisign'><NavLink to='/signup' exact>Sign Up</NavLink></li>
                    :<li id = 'lisign'><NavLink to={'/user/'+this.props.login_id} exact>My Page</NavLink></li>}
                    <li id = 'licreate'><NavLink to='/create' exact>Create</NavLink></li>
                    </div>
                </div>
                <div id='nav'>
                <ul id = 'Navlist'>
                    <li> <a id='navitem' onClick={() => {this.clickCategoryHandler(1)}}> 중식 </a>
                    </li>
                    <li> <a id='navitem' onClick={() => {this.clickCategoryHandler(2)}}> 한식 </a>
                    </li>
                    <li> <a id='navitem' onClick={() => {this.clickCategoryHandler(3)}}> 양식 </a>
                    </li>
                    <li> <a id='navitem' onClick={() => {this.clickCategoryHandler(4)}}> 일식 </a>
                    </li>
                    <li> <a id='navitem'onClick={() => {this.clickCategoryHandler(5)}}> 디저트 </a>
                    </li>
                    <li> <a id='navitem' onClick={() => {this.clickCategoryHandler(6)}}> 편의점 </a>
                    </li>
                    <li><NavLink id='navitem' to='/meal-planner' exact>식단표</NavLink></li>
                </ul>
                </div>
            </div>
        )        
    }
}
const mapStateToProps = (state) => {
    return {
        login_id: state.user.login_id
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        isLogin: () => dispatch(actionCreators.isLogin()),
        onLogout: () => dispatch(actionCreators.signOut())
    }
}
Navbar.propTypes = {
    history: PropTypes.object,
    storedRecipes: PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)