import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";
import Recipe from '../../components/Recipe/Recipe';
import SimpleUserInfo from '../../components/UserInfo/SimpleUserInfo';
import MyInfo from '../MyInfo/MyInfo';
import Recipes from '../../components/Recipe/Recipes';
import './MyPage.css';
import * as actionCreators from '../../store/actions/index';

class MyPage extends Component{

    state={
        tab: 'my-profile',
        login_id: -1,
        editable: false,
    }

    onClickTabHandler(tab){
        if(tab == 'my-info' && !this.state.editable) return;
        this.setState({tab: tab});
    }

    componentDidMount(){
        this.props.isLogin().then(response => {
            this.setState({
                login_id: response.login_id,
            })
            console.log(this.props.match.params.id);
            console.log(response.login_id);
            let id=this.props.match.params.id;
            this.setState({
                editable: id == response.login_id,
            })
            this.props.onGetUser(id)
        })
        
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
                        author={recipe.author}
                        thumbnail={recipe.thumbnail}
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
                        author={recipe.author}
                        thumbnail={recipe.thumbnail}
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
                        author={recipe.author}
                        thumbnail={recipe.thumbnail}
                        title={recipe.title}
                        rating={recipe.rating}
                        cost={recipe.price}
                        likes={recipe.likes}
                        clickedRecipe={() => this.clickRecipeHandler(recipe.id)}
                        clickedLikes={null}
                    />
                );
            });
        }
        
        return (
        <div id = 'mypageBack'>
            <div className='MyPage'>
                <div className='left'>
                    <div id = "mypagetab" className = 'my-profile-button' onClick = {() => this.onClickTabHandler('my-profile')}
                        style = {{backgroundColor: this.state.tab=='my-profile' ? "#d1bb5a" : null}}>
                    프로필
                    </div>
                    <div id = "mypagetab" className = 'my-info-button' onClick = {() => this.onClickTabHandler('my-info')}
                        style = {{backgroundColor: this.state.tab=='my-info' ? "grey" : null}}>
                    My Info
                    </div>
                    <div id = "mypagetab" className = 'liked-recipes-button' onClick = {() => this.onClickTabHandler('liked-recipes')}
                        style = {{backgroundColor: this.state.tab=='liked-recipes' ? "#d1bb5a" : null}}> 
                    좋아요한 레시피
                    </div>
                    <div id = "mypagetab" className = 'recipe-basket-button' onClick = {() => this.onClickTabHandler('recipe-basket')}
                        style = {{backgroundColor: this.state.tab=='recipe-basket' ? "#d1bb5a" : null}}> 
                    장바구니
                    </div>
                    <div id = "mypagetab" className = 'written-recipes-button' onClick = {() => this.onClickTabHandler('written-recipes')}
                        style = {{backgroundColor: this.state.tab=='written-recipes' ? "#d1bb5a" : null}}>
                    작성한 레시피   
                    </div>
                </div>
                <div className='right'>
                    {
                        this.state.tab=='my-profile' && 
                            <div className = 'my-profile'>
                                <div  id = 'infoblock'>
                                    <div id='mylabel'><p id='my' >my Info</p></div>
                                    {simpleMyInfo}
                                </div>
                                <div id = 'infoblock'>
                                    <div id='mylabel'>
                                    <p id='my'>liked recipes</p>
                                    <button id='userdetail' onClick = {() => this.onClickTabHandler('liked-recipes')}>detail</button>
                                </div>
                                    <div id='lr'>{likedRecipes.slice(0,5)}</div>
                                </div>
                                <div id='infoblock'> 
                                    <div id='mylabel'>
                                        <p id='my'>recipe basket</p>
                                        <button id='userdetail' onClick = {() => this.onClickTabHandler('recipe-basket')}>detail</button>
                                    </div>
                                    <div id='lr'>{recipeBasket.slice(0,5)}</div>
                                </div>
                                <div id='infoblock'> 
                                    <div id='mylabel'>
                                        <p id='my'>written recipes</p>
                                        <button id='userdetail' onClick = {() => this.onClickTabHandler('written-recipes')}>detail</button>
                                    </div>
                                    <div id='wr'>{writtenRecipes.slice(0,5)}</div>
                                </div>
                            </div>
                    }
                    {this.state.tab=='my-info' && <div className = 'my-info'>
                    {myInfo}
                    </div>}
                    {this.state.tab=='liked-recipes' && <div className = 'liked-recipes'>
                    <p>liked recipes</p>
                    <div id='lr'>{<Recipes recipes={likedRecipes}/>}</div>
                    </div>}
                    {this.state.tab=='recipe-basket' && <div className = 'recipe-basket'>
                    <p>recipe basket</p>
                    <div id='lr'>{<Recipes recipes={recipeBasket}/>}</div>
                    </div>}
                    {this.state.tab=='written-recipes' && <div className = 'written-recipes'>
                    <p>written recipes</p>
                    <div id='wr'>{<Recipes recipes={writtenRecipes}/>}</div>
                    </div>}
                </div>
            </div>
        </div>
        )
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
        isLogin: () => dispatch(actionCreators.isLogin()),
    }
}

MyPage.propTypes = {
    history: PropTypes.object,
    storedUser: PropTypes.object,
    onGetUser: PropTypes.func,
};

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(MyPage));
