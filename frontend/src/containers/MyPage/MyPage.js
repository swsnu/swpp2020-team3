import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";
import Recipe from '../../components/Recipe/Recipe';
import SimpleUserInfo from '../../components/UserInfo/SimpleUserInfo';
import MyInfo from '../MyInfo/MyInfo';
//import './MyPage.css';
import * as actionCreators from '../../store/actions/index';

class MyPage extends Component{

    state={
        tab: 'my-profile',
    }

    onClickTabHandler(tab){
        this.setState({tab: tab});
    }

    componentDidMount(){
        let id=this.props.match.params.id;
        this.props.onGetUser(id);
    }

    clickRecipeHandler = id => {
        this.props.history.push('/detail-page/'+id);
    }

    render(){
        let myInfo=[];
        let simpleMyInfo=[];
        let likedRecipes=[];
        let recipeBasket=[];
        let writtenRecipes=[];
        let follower = [];
        let following = [];
        if(this.props.storedUser){
            myInfo = this.props.storedUser.user_info.map((user) => {
                return (
                    <MyInfo key={user.id}
                        id = {user.id}
                        username = {user.username}
                        first_name = {user.first_name}
                        last_name = {user.last_name}
                        email = {user.email}
                    />
                );
            });
            simpleMyInfo = this.props.storedUser.user_info.map((user) => {
                console.log(user)
                return (
                    <SimpleUserInfo key={user.id}
                        username = {user.username}
                        first_name = {user.first_name}
                        last_name = {user.last_name}
                        email = {user.email}
                    />
                );
            });
            likedRecipes = this.props.storedUser.liked_recipes.map((recipe) => {
                return (
                    <Recipe key={recipe.id}
                        author={recipe.author__username}
                        thumbnail={'data:image/png;base64,'+recipe.thumbnail}
                        title={recipe.title}
                        rating={recipe.rating}
                        cost={recipe.price}
                        likes={recipe.likes}
                        clickedRecipe={() => this.clickRecipeHandler(recipe.id)}
                        clickedLikes={null}
                    />
                );
            });
            recipeBasket = this.props.storedUser.recipe_basket.map((recipe) => {
                return (
                    <Recipe key={recipe.id}
                        author={recipe.author__username}
                        thumbnail={'data:image/png;base64,'+recipe.thumbnail}
                        title={recipe.title}
                        rating={recipe.rating}
                        cost={recipe.price}
                        likes={recipe.likes}
                        clickedRecipe={() => this.clickRecipeHandler(recipe.id)}
                        clickedLikes={null}
                    />
                );
            });
            writtenRecipes = this.props.storedUser.written_recipes.map((recipe) => {
                return (
                    <Recipe key={recipe.id}
                        author={recipe.author__username}
                        thumbnail={'data:image/png;base64,'+recipe.thumbnail}
                        title={recipe.title}
                        rating={recipe.rating}
                        cost={recipe.price}
                        likes={recipe.likes}
                        clickedRecipe={() => this.clickRecipeHandler(recipe.id)}
                        clickedLikes={null}
                    />
                );
            });
            follower = this.props.storedUser.follower.map((user) => {
                return (
                    <SimpleUserInfo key={user.id}
                        username = {user.username}
                        first_name = {user.first_name}
                        last_name = {user.last_name}
                        email = {user.email}
                    />
                );
            });
            following = this.props.storedUser.following.map((user) => {
                return (
                    <SimpleUserInfo key={user.id}
                        username = {user.username}
                        first_name = {user.first_name}
                        last_name = {user.last_name}
                        email = {user.email}
                    />
                );
            });
        }
        
        return <div className='MyPage'>
            <div className='left'>
                <div className = 'my-profile-button' onClick = {() => this.onClickTabHandler('my-profile')}
                    style = {{backgroundColor: this.state.tab=='my-profile' ? "grey" : null}}>
                My Profile
                </div>
                <div className = 'my-info-button' onClick = {() => this.onClickTabHandler('my-info')}
                    style = {{backgroundColor: this.state.tab=='my-info' ? "grey" : null}}>
                My Info
                </div>
                <div className = 'liked-recipes-button' onClick = {() => this.onClickTabHandler('liked-recipes')}
                    style = {{backgroundColor: this.state.tab=='liked-recipes' ? "grey" : null}}> 
                Liked recipes
                </div>
                <div className = 'recipe-basket-button' onClick = {() => this.onClickTabHandler('recipe-basket')}
                    style = {{backgroundColor: this.state.tab=='recipe-basket' ? "grey" : null}}> 
                Recipe basket
                </div>
                <div className = 'written-recipes-button' onClick = {() => this.onClickTabHandler('written-recipes')}
                    style = {{backgroundColor: this.state.tab=='written-recipes' ? "grey" : null}}>
                Written recipes   
                </div>
                <div className = 'follower-button' onClick = {() => this.onClickTabHandler('follower')}
                    style = {{backgroundColor: this.state.tab=='follower' ? "grey" : null}}>
                Follower
                </div>
                <div className = 'following-button' onClick = {() => this.onClickTabHandler('following')}
                    style = {{backgroundColor: this.state.tab=='following' ? "grey" : null}}>
                Following
                </div>
            </div>
            <div className='right'>
                {this.state.tab=='my-profile' && <div className = 'my-profile'>
                <p>my Info</p>
                {simpleMyInfo}
                <p>liked recipes</p>
                {likedRecipes.slice(0,5)}
                <p>recipe basket</p>
                {recipeBasket.slice(0,5)}
                <p>written recipes</p>
                {writtenRecipes.slice(0,5)}
                </div>}
                {this.state.tab=='my-info' && <div className = 'my-info'>
                <p>my Info</p>
                {myInfo}
                </div>}
                {this.state.tab=='liked-recipes' && <div className = 'liked-recipes'>
                <p>liked recipes</p>
                {likedRecipes}
                </div>}
                {this.state.tab=='recipe-basket' && <div className = 'recipe-basket'>
                <p>recipe basket</p>
                {recipeBasket}
                </div>}
                {this.state.tab=='written-recipes' && <div className = 'written-recipes'>
                <p>written recipes</p>
                {writtenRecipes}
                </div>}
                {this.state.tab=='follower' && <div className = 'follower'>
                <p>follower</p>
                {follower}
                </div>}
                {this.state.tab=='following' && <div className = 'following'>
                <p>following</p>
                {following}
                </div>}
            </div>
        </div>
    }
}

const mapStateToProps = state => {
    return {
        storedUser: state.user.getuser,
    };
}
  
const mapDispatchToProps = dispatch => {
    return {
        onGetUser: (id) =>
            dispatch(actionCreators.getUser(id)),
    }
}

MyPage.propTypes = {
    history: PropTypes.object,
    storedUser: PropTypes.object,
    onGetUser: PropTypes.func,
};

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(MyPage));
