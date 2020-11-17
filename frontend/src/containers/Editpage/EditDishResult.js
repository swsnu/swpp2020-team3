import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as actionCreators from '../../store/actions/index';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import Select from 'react-select'

class EditDishResult extends Component {
    state = {
        title: this.props.recipe && this.props.recipe.title,
        price: this.props.recipe && this.props.recipe.price,
        likes: this.props.recipe && this.props.recipe.likes,
        rating: this.props.recipe && this.props.recipe.rating,
        category: this.props.recipe && this.props.recipe.category,
        abstraction: this.props.recipe && this.props.recipe.summary,
        selectedIngredientList: this.props.recipe && this.props.recipe.ingredient_list,
        tags: this.props.recipe && this.props.recipe.tag_list,
        thumbnail_preview: this.props.recipe && 'data:image/png;base64,'+ this.props.recipe.thumbnail,

        ingredientList: this.props.ingredientList,
    }

    componentDidMount(){
        console.log("mount child")
        console.log(this.props.ingredientList)
        this.props.getRecipe(parseInt(this.props.match.params.id)).then((res) => {
            res = res.selectedRecipe
            this.setState({
            title: res.title,
            price: res.price,
            likes: res.likes,
            rating: res.rating,
            category: res.category,
            abstraction: res.summary,
            selectedIngredientList: res.ingredient_list,
            tags: res.tag_list,
            thumbnail_preview: 'data:image/png;base64,'+ res.thumbnail,
        })});
        this.props.onGetIgrList().then((res) => {
            console.log(res)
            this.setState({ingredientList: res.ingredients})
        })
    }

    updateState(key, value){
        this.props.updateState(key, value)
    }

    render() {
        console.log(this.state)
        return (
            <div className='dish_result'>
                <div id = 'detailbox1'>
                    <div id = 'detailbox1area1'>
                        <div className = "area1text">
                            <input id='detailtitle' value={this.state.title} onChange={(event) => {this.setState({title: event.target.value})}}/>
                            <br/>
                            <div id = 'detailinfo'>
                                <p id='detaillabel'>{'가격'}</p>
                                {this.state.price}
                                <br/>
                                <p id='detaillabel'>{'추천수'}</p>
                                {this.state.likes}
                                <br/>
                                <p id='detaillabel'>{'평점'}</p>
                                {this.state.rating}
                                <br/>
                                <p id='detaillabel'>{'카테고리'}</p>
                                {"make into select"}
                                <input id='detailcategory' value={this.state.category} onChange={(event) => {this.setState({category: event.target.value})}}/>
                                <br/>
                                <p id='detaillabel'>{'태그'}</p>
                                {/* {tag} */}
                            </div>
                        </div>
                        <div id = 'detailthumbnail'>
                            {/* {thumbnail} */}
                            <input type="file" accept='.jpg, .png, .jpeg' onChange={(event) => this.imageHandler(event)}/>
                        </div>
                    </div>
                    <div id = 'detailtitle2'>{'레시피 간단 설명'}</div>
                    <div id = 'detailsummary'>
                        <textarea id='detailabstraction' value={this.state.abstraction} onChange={(event) => {this.setState({abstraction: event.target.value})}}/>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        recipe: state.rcp.selectedRecipe,
        ingredientList: state.rcp.ingredientList
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getRecipe: (id) => dispatch(actionCreators.getRecipe(id)),
        onGetIgrList: () => dispatch(actionCreators.getIngredients())
        // deleteRecipe: (id) => dispatch(actionCreators.deleteRecipe(id))
    };
}

EditDishResult.propTypes = {
    getRecipe: PropTypes.func,
    deleteRecipe: PropTypes.func,
    recipe: PropTypes.object,
    match: PropTypes.object,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditDishResult));