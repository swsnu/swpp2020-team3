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
    componentDidMount(){
        console.log('ds')
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
                    photo_list: res['selectedRecipe'].photo_list,
                })
                if(this.state.photo_list){
                    let list = this.state.photo_list.map((item) => (
                        'data:image/png;base64,'+item
                    ))
                    this.setState({photo_list: list})
                }
            })
    }

    setParentState(key, value){
        this.setState({[key]: value})
    }
    
    addStepHandler(){
        let newList = this.state.description_list
        newList.push('')
        this.setState({description_list: newList})
    }
    imageHandler(event, index){
        let file = event.target.files[0]
        let reader = new FileReader();
        reader.onloadend = () => {
            let newImgList = this.state.photo_list;
            newImgList[index] = reader.result
            this.setState({
                photo_list: newImgList,
            })
        }
        reader.readAsDataURL(file)
    }
    changeExplanation(event, index){
        let list = this.state.description_list
        list[index] = event.target.value
        this.setState({'description_list': list})
    }
    deleteStep(index){
        let newDList = this.state.description_list;
        let newIList = this.state.photo_list;
        newDList.splice(index, 1)
        newIList.splice(index, 1)
        this.setState({description_list: newDList})
        this.setState({photo_list: newIList})
    }

    onSubmit(){
        // this.props.editRecipe(this.props.match.params.id)
        console.log('submit')
        console.log(this.state)
    }

    render() {
        const methodData = this.state.description_list && this.state.description_list.map((item, index) => ({img: this.state.photo_list[index], explanation:item}))
        const methods = methodData && methodData.map((item, index) => 
        <div className='edit-dish_step'>
            <br/>
            <img src={item.img} width='600'/>
            <input type="file" accept='.jpg, .png, .jpeg' onChange={(event) => this.imageHandler(event, index)}/>
            <div className='dish_explanation'>
                <input id='detailtitle' value={this.state.description_list[index]} onChange={(event) => {this.changeExplanation(event, index)}}/>
                <button id = "delete-button" onClick={() => this.deleteStep(index)}>Delete</button>
            </div>
            <br/>
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
                                <button onClick={()=> this.addStepHandler()}>Add step</button>
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
        // editRecipe: (id) => dispatch(actionCreators.putRecipe(id))
    };
}

Editpage.propTypes = {
    getRecipe: PropTypes.func,
    deleteRecipe: PropTypes.func,
    recipe: PropTypes.object,
    match: PropTypes.object,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Editpage));