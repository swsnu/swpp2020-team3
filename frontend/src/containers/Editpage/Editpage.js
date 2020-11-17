import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';

import * as actionCreators from '../../store/actions/recipe';

import DishResult from '../../components/detail/DishResult';
import DishStep from '../../components/detail/DishStep';
import Comments from '../comments/Comments';
import EditDishResult from './EditDishResult';
import EditDishStep from './EditDishStep';

class Editpage extends Component {
state = {


}
    constructor(props){
        super(props);
        this.props.getRecipe(this.props.match.params.id)
            .then((res) => {
                this.setState({
                    title: res['selectedRecipe'].title,
                    price: res['selectedRecipe'].price,
                    rating: res['selectedRecipe'].rating,
                    likes: res['selectedRecipe'].likes,
                    category: res['selectedRecipe'].category,
                    summary: res['selectedRecipe'].summary,
                    ingredient_list: res['selectedRecipe'].ingredient_list,
                    tag_list: res['selectedRecipe'].tag_list,
                    thumbnail: res['selectedRecipe'].thumbnail,
                    description_list: res['selectedRecipe'].description_list,
                    photo_list: res['selectedRecipe'].photo_list
                })
            })
    }

    setParentState(key, value){
        this.setState({[key]: value})
    }
    setParentStateList(key, value=-1, index){
        if(typeof value == typeof 1){
            console.log("delete")
            let newDList = this.state.description_list;
            let newIList = this.state.photo_list;
            newDList.splice(index, 1)
            newIList.splice(index, 1)
            console.log(newDList)
            console.log(newIList)
            this.setState({description_list: newDList})
            this.setState({image_list: newIList})
        }
        let list = this.state[key]
        list[index] = value
        this.setState({[key]: list})
    }

    onSubmit(){
        // put
    }

    render() {
        console.log(this.state)
        const methodData = this.state.description_list && this.state.description_list.map((item, index) => ({img:'data:image/png;base64,'+ this.state.photo_list[index], explanation:item}))
        const methods = methodData && methodData.map((item, index) => <div>
                                <EditDishStep key={index} explanation={this.state.description_list[index]} 
                                            updateState={(key,value) => this.setParentStateList(key, value, index)} />
                                <img src={item.img}  width='600'/>
                                </div>)

        return (
            <div id = 'detailBackground'>
                <div className="Detailpage">
                    <p>Hello</p>
                    <div id = "detailBlock">
                        <EditDishResult id={this.props.match.params.id} updateState={(key,value) => this.setParentState(key, value)}/>
                        <div className='dish_method'>
                            <div id = 'detailtitle3'>{'조리 순서'}</div>
                            <div id = 'detailmethod'>
                                {methods}
                            </div>
                        </div>

                        <button onClick={() => this.onSubmit()}>Submit</button>
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