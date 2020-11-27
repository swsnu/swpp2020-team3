import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';

import * as actionCreators from '../../store/actions/index';

import DishResult from '../../components/detail/DishResult';
import DishStep from '../../components/detail/DishStep';
import Comments from '../comments/Comments';
import './Detailpage.css'
//import './Detailpage.css';

class Detailpage extends Component {

    state = {
        login_id: -1,
        like: 0,
        scrap: 0,
    };
    constructor(props) {
        super(props);
        this.props.getRecipe(this.props.match.params.id);
        this.props.isLogin().then(res => {
            this.setState({
                login_id: res.login_id
            })
        })
    }

    isLike = () => {
        console.log(this.props.recipe)
        if(!this.props.recipe) return 0;
        for(let id of this.props.recipe.liked_user){
            if(id==this.state.login_id){
                return 1;
            }
        }
        return 0;
    }
    isScrap = () => {
        if(!this.props.recipe) return 0;
        for(let id of this.props.recipe.scrapped_user){
            if(id==this.state.login_id){
                return 1;
            }
        }
        return 0;
    }
    
    handleLike = () => {
        let flag = 0;
        for(let id of this.props.recipe.liked_user){
            if(id==this.state.login_id){
                flag = 1;
            }
        }
        if(!flag){
            this.props.likeRecipe(this.props.recipe.id);
        }
        else {
            this.props.removelikeRecipe(this.props.recipe.id);
        }
    }

    handleScrap = () => {
        let flag = 0;
        for(let id of this.props.recipe.scrapped_user){
            if(id==this.state.login_id){
                flag = 1;
            }
        }
        if(!flag) {
            this.props.scrapRecipe(this.props.recipe.id);
        }
        else {
            this.props.removescrapRecipe(this.props.recipe.id);
        }
    }
    

    render() {
        const title = this.props.recipe && this.props.recipe.title;
        const abstraction = this.props.recipe && this.props.recipe.summary;
        const descriptions = this.props.recipe && this.props.recipe.description_list;
        const rating  = this.props.recipe && this.props.recipe.rating
        const likes = this.props.recipe && this.props.recipe.likes
        const price = this.props.recipe && this.props.recipe.price
        const category = this.props.recipe && this.props.recipe.category
        const author = this.props.recipe && this.props.recipe.author
        const liked_user = this.props.recipe && this.props.recipe.liked_user
        const scrapped_user = this.props.recipe && this.props.recipe.scrapped_user
        

        console.log(this.state);

        let igd;
        if(this.props.recipe && this.props.recipe.ingredient_list){
            igd = this.props.recipe.ingredient_list.map( (igd) => {
                let img = 'data:image/png;base64,'+igd.picture
                return (
                    <div key={igd.id} id='detailigd'>
                        <div id = 'detailigdinfo'>
                            <div id='igdlabel'>{"이름: "+igd.name}</div>
                            <div id='igdlabel'>{'브랜드: '+igd.brand}</div>
                            <div id='igdlabel'>{"수량: "+igd.quantity+igd.igd_type+' * '+igd.amount}</div>
                            <div id='igdlabel'>{"가격: "+igd.price+'원'}</div>
                        </div>
                        {<img id = 'detailimg' src={img} width='200'/>}
                    </div>
                )
            })
        }

        console.log(this.props.recipe)
        let d = null;
        if(this.props.recipe){
            d = 'data:image/png;base64,'+ this.props.recipe.thumbnail;
        }
        const methodData = descriptions && descriptions.map((item, index) => ({img:'data:image/png;base64,'+ this.props.recipe.photo_list[index], explanation:item}))
        const methods = methodData && methodData.map((item) => <DishStep key={item.id} img={item.img} explanation={item.explanation}/>)
        return (
            <div id = 'detailBackground'>
                <div className="Detailpage">
                    <div id = "detailBlock">
                        {(this.state.login_id==author)?<div><button id = 'edit-button' onClick={() => this.props.history.push(`/edit/${this.props.match.params.id}/`)}>Edit</button>
                        <button id = "delete-button" onClick={() => this.props.deleteRecipe(this.props.match.params.id)}>Delete</button></div>:null}
                        <DishResult img={<img src = {d} width='396' height='330'/>} price = {price} category = {category} 
                            likes = {likes} rating={rating} title={title} abstraction={abstraction} ingredients={igd}
                            loginid={this.state.login_id} onlikeClicked = {() =>  this.handleLike()} onscrapClicked = {() => this.handleScrap()}
                            islike = {this.isLike()} isscrap = {this.isScrap()}
                        />
                        <div className='dish_method'>
                            <div id = 'detailtitle3'>{'조리 순서'}</div>
                            <div id = 'detailmethod'>
                                {methods}
                            </div>
                        </div>
                    </div>
                </div>
                <div id='detailcomment'><Comments id='comment' login_id={this.state.login_id} history={this.props.history} recipeId={this.props.match.params.id}/></div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        recipe: state.rcp.selectedRecipe
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getRecipe: (id) => dispatch(actionCreators.getRecipe(id)),
        deleteRecipe: (id) => dispatch(actionCreators.deleteRecipe(id)),
        isLogin: () => dispatch(actionCreators.isLogin()),
        likeRecipe: (id) => dispatch(actionCreators.likeRecipe(id)),
        removelikeRecipe: (id) => dispatch(actionCreators.removelikeRecipe(id)),
        scrapRecipe: (id) => dispatch(actionCreators.scrapRecipe(id)),
        removescrapRecipe: (id) => dispatch(actionCreators.removescrapRecipe(id))
    };
}

Detailpage.propTypes = {
    getRecipe: PropTypes.func,
    deleteRecipe: PropTypes.func,
    recipe: PropTypes.object,
    match: PropTypes.object,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Detailpage));