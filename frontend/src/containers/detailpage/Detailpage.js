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
        console.log(this.props.recipe)
        console.log(typeof(descriptions))
        const methodData = descriptions && descriptions.map((item) => ({img: require('../../Image/LOGO.png'), explanation:item}))
        const methods = methodData && methodData.map((item) => <DishStep img={item.img} explanation={item.explanation}/>)
        return (
            <div className="Detailpage">
                <DishResult img={require('../../Image/LOGO.png')} title={title} abstraction={abstraction} ingredients='no'/>
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