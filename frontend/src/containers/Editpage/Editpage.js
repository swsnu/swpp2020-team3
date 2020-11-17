import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';

import * as actionCreators from '../../store/actions/recipe';

import DishResult from '../../components/detail/DishResult';
import DishStep from '../../components/detail/DishStep';
import Comments from '../comments/Comments';
import EditDishResult from './EditDishResult';

class Editpage extends Component {
state = {
    recipe: this.props.recipe && this.props.recipe

}
    componentDidMount(){
        this.props.getRecipe(this.props.match.params.id)
            .then((res) => {
                this.setState({recipe: res['selectedRecipe']})
            })
    }

    setParentState(key, value){
        this.setState({[key]: value})
    }

    render() {
        return (
            <div id = 'detailBackground'>
                <div className="Detailpage">
                    <p>Hello</p>
                    <div id = "detailBlock">
                        <EditDishResult id={this.props.match.params.id} updateState={(key,value) => this.setParentState(key, value)}/>
                        <div className='dish_method'>
                            <div id = 'detailtitle3'>{'조리 순서'}</div>
                            <div id = 'detailmethod'>
                                {/* {methods} */}
                                {/* <button id = "delete-button" onClick={() => this.props.deleteRecipe(this.props.match.params.id)}>Delete</button> */}
                            </div>
                        </div>

                        <button onClick={() => this.setState({submit: true})}>Submit</button>
                    </div>
                    <Comments recipeId={parseInt(this.props.match.params.id)}/>
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
        onGetIgrList: () => dispatch(actionCreators.getIngredients()),
        deleteRecipe: (id) => dispatch(actionCreators.deleteRecipe(id))
    };
}

Editpage.propTypes = {
    getRecipe: PropTypes.func,
    deleteRecipe: PropTypes.func,
    recipe: PropTypes.object,
    match: PropTypes.object,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Editpage));