import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

import * as actionCreators from '../../store/actions/index';

import DishResult from '../../components/detail/DishResult';
import DishStep from '../../components/detail/DishStep';
import Comments from '../comments/Comments';
//import './Detailpage.css';

class Detailpage extends Component {

    constructor(props) {
        super(props);
        this.props.getRecipe(this.props.match.params.id);
    }
    render() {

        const title = this.props.recipe && this.props.recipe.title;
        const abstraction = this.props.recipe && this.props.recipe.summary;
        const descriptions = this.props.recipe && this.props.recipe.description_list.descriptions;
        let igd;
        if(this.props.recipe){
            igd = this.props.recipe.ingredient_list.map( (igd) => {
                let img = 'data:image/png;base64,'+igd.picture
                return (
                    <div>
                        <p>재료</p>
                        {igd.name}
                        {igd.brand}
                        {igd.quantity}
                        {igd.igd_type}
                        {igd.price}
                        {<img src={img} width='100'/>}
                    </div>
                )
            })
        }
        console.log(this.props.recipe)
        console.log(typeof(descriptions))
        let d = null;
        if(this.props.recipe){
            d = 'data:image/png;base64,'+ this.props.recipe.photo_list[0]
        }
        const methodData = descriptions && descriptions.map((item, index) => ({img:'data:image/png;base64,'+ this.props.recipe.photo_list[index], explanation:item}))
        const methods = methodData && methodData.map((item) => <DishStep img={item.img} explanation={item.explanation}/>)

        return (
            <div className="Detailpage">
                <DishResult img={<img src = {d} width='100'/>} title={title} abstraction={abstraction} ingredients={igd}/>
                <div className='dish_method'>
                    {methods}
                    <button>Edit</button>
                    <button>Delete</button>
                </div>
                <Comments recipeId={this.props.match.params.id}/>
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
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Detailpage));