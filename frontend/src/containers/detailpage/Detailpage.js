import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

import * as actionCreators from '../../store/actions/index';

import DishResult from '../../components/detail/DishResult';
import DishStep from '../../components/detail/DishStep';
import Comments from '../comments/Comments';
import './Detailpage.css'
//import './Detailpage.css';

class Detailpage extends Component {

    constructor(props) {
        super(props);
        console.log(12)
        this.props.getRecipe(this.props.match.params.id);
    }
    render() {
        const title = this.props.recipe && this.props.recipe.title;
        const abstraction = this.props.recipe && this.props.recipe.summary;
        const descriptions = this.props.recipe && this.props.recipe.description_list;
        const rating  = this.props.recipe && this.props.recipe.rating
        const likes = this.props.recipe && this.props.recipe.likes
        const price = this.props.recipe && this.props.recipe.price
        const category = this.props.recipe && this.props.recipe.category
        const tags = this.props.recipe && this.props.recipe.tag_list
        let igd;
        console.log(this.props.recipe)
        if(this.props.recipe){
            igd = this.props.recipe.ingredient_list.map( (igd) => {
                let img = 'data:image/png;base64,'+igd.picture
                return (
                    <div id='detailigd'>
                        <div id = 'detailigdinfo'>
                            <div id='igdlabel'>{igd.name}</div>
                            <div id='igdlabel'>{'('+igd.brand+')'}</div>
                            <div id='igdlabel'>{igd.quantity+igd.igd_type}</div>
                            <div id='igdlabel'>{igd.price+'원'}</div>
                        </div>
                        {<img id = 'detailimg' src={img} width='200'/>}
                    </div>
                )
            })
        }
        let d = null;
        if(this.props.recipe){
            console.log(this.props.recipe.photo_list[0])
            console.log(this.props.recipe)
            d = 'data:image/png;base64,'+ this.props.recipe.thumbnail;
        }
        const methodData = descriptions && descriptions.map((item, index) => ({img:'data:image/png;base64,'+ this.props.recipe.photo_list[index], explanation:item}))
        const methods = methodData && methodData.map((item) => <DishStep img={item.img} explanation={item.explanation}/>)

        return (
            <div id = 'detailBackground'>
                <div className="Detailpage">
                    <div id = "detailBlock">
                        <DishResult img={<img src = {d} width='500'/>} tag={tags} price = {price} category = {category} likes = {likes} rating={rating} title={title} abstraction={abstraction} ingredients={igd}/>
                        <div className='dish_method'>
                            <div id = 'detailtitle3'>{'조리 순서'}</div>
                            <div id = 'detailmethod'>
                                {methods}
                                <button>Edit</button>
                                <button id = "delete-button" onClick={() => this.props.deleteRecipe(this.props.match.params.id)}>Delete</button>
                            </div>
                        </div>
                        <Comments recipeId={this.props.match.params.id}/>
                    </div>
                </div>
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
        deleteRecipe: (id) => dispatch(actionCreators.deleteRecipe(id))
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Detailpage));