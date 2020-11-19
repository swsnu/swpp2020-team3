import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';

import * as actionCreators from '../../store/actions/index';

import DishResult from '../../components/detail/DishResult';
import DishStep from '../../components/detail/DishStep';
import Comments from '../comments/Comments';
import EditDishResult from './EditDishResult';

class Editpage extends Component {

    constructor(props) {
        super(props);
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
        if(this.props.recipe){
            igd = this.props.recipe.ingredient_list.map( (igd) => {
                let img = 'data:image/png;base64,'+igd.picture
                return (
                    <div key={igd.id} id='detailigd'>
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
            d = 'data:image/png;base64,'+ this.props.recipe.thumbnail;
        }
        const methodData = descriptions && descriptions.map((item, index) => ({img:'data:image/png;base64,'+ this.props.recipe.photo_list[index], explanation:item}))
        const methods = methodData && methodData.map((item) => <DishStep key={item.id} img={item.img} explanation={item.explanation}/>)

        return (
            <div id = 'detailBackground'>
                <div className="Detailpage">
                    <div id = "detailBlock">
                        <EditDishResult id={this.props.match.params.id} img={<img src = {d} width='500'/>} tag={tags} price = {price} category = {category} likes = {likes} rating={rating} title={title} abstraction={abstraction} ingredients={igd}/>
                        <div className='dish_method'>
                            <div id = 'detailtitle3'>{'조리 순서'}</div>
                            <div id = 'detailmethod'>
                                {methods}
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

Editpage.propTypes = {
    getRecipe: PropTypes.func,
    deleteRecipe: PropTypes.func,
    recipe: PropTypes.object,
    match: PropTypes.object,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Editpage));


///////////////////


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

        ingredientList: this.props.ingredientList
        
    }

    componentDidMount(){
        console.log("mount")
        console.log(this.props.match.params.id)
        this.props.getRecipe(this.props.id);
        this.props.onGetIgrList()
    }
    // updateParentState(){
    //}
    // use it instead of setState


    imageHandler(event){
        let file = event.target.files[0]
        let reader = new FileReader();
        reader.onloadend = () => {
            this.setState({thumbnail_preview: reader.result})
            this.setState({thumbnail_file: file})
        }
        reader.readAsDataURL(file)
    }

    addSelectedIngredientHandler(event){
        if(this.state.ingredientList == null){
            this.setState({ingredientList: this.props.ingredientList})
        }
        let list1 = this.state.selectedIngredientList.concat(event)
        this.setState({selectedIngredientList: list1})
        let list2 = this.props.ingredientList
        let list = list2.filter((ing) => {
            return !list1.includes(ing)
        })
        this.setState({ingredientList: list})
        //console.log(list1)
    }

    render() {
        const showigd = this.state.selectedIngredientList ? this.state.selectedIngredientList.map((ing) => <div>{ing.name}</div>) : null
        const select = this.state.ingredientList.length == 0
        ? <Select options={this.props.ingredientList} 
        getOptionLabel={option => `[${option.brand}] ${option.name} (${option.price}원 - normalized price)`}
        onChange={(event) => this.addSelectedIngredientHandler(event)}
        isSearchable={true} placeholder={'재료를 입력하시오.'} value='' autoFocus={true}/>
        : <Select options={this.state.ingredientList} 
        getOptionLabel={option => `[${option.brand}] ${option.name} (${option.price}원 - normalized price)`}
        onChange={(event) => this.addSelectedIngredientHandler(event)}
        isSearchable={true} placeholder={'재료를 입력하시오.'} value='' autoFocus={true}/>
        const tag = this.state.tags ? this.state.tags.map((tag) => <span key={tag} id='tag'>{tag} </span>) : null
        let thumbnail = this.state.thumbnail_preview ? <img src={this.state.thumbnail_preview} width='250' height='200' /> : <img src={this.props.recipe.thumbnail} width='250' height='200' />

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
                                {tag}
                            </div>
                        </div>
                        <div id = 'detailthumbnail'>
                            {thumbnail}
                            <input type="file" accept='.jpg, .png, .jpeg' onChange={(event) => this.imageHandler(event)}/>
                        </div>
                    </div>
                    <div id = 'detailtitle2'>{'레시피 간단 설명'}</div>
                    <div id = 'detailsummary'>
                        <textarea id='detailabstraction' value={this.state.abstraction} onChange={(event) => {this.setState({abstraction: event.target.value})}}/>
                    </div>
                </div>
                <div id = 'detailbox2'>
                    <div id = 'detailtitle3'>{'레시피 재료'}</div>
                        <p>재료 추가</p>
                        {/* {this.state.ingredientList == null
                        ? <Select options={this.props.ingredientList} 
                        getOptionLabel={option => `[${option.brand}] ${option.name} (${option.price}원 - normalized price)`}
                        onChange={(event) => this.addSelectedIngredientHandler(event)}
                        isSearchable={true} placeholder={'재료를 입력하시오.'} value='' autoFocus={true}/>
                        : <Select options={this.state.ingredientList} 
                        getOptionLabel={option => `[${option.brand}] ${option.name} (${option.price}원 - normalized price)`}
                        onChange={(event) => this.addSelectedIngredientHandler(event)}
                        isSearchable={true} placeholder={'재료를 입력하시오.'} value='' autoFocus={true}/>} */}
                        {select}

                    {showigd}
                    <button > Add ingredient and quantity </button>
                </div>
            </div>
        )
    }
}

EditDishResult.propTypes = {
    ingredients: PropTypes.array,
    tag: PropTypes.string,
    price: PropTypes.number,
    likes: PropTypes.number,
    title: PropTypes.string,
    rating: PropTypes.number,
    category: PropTypes.string,
    img: PropTypes.string,
    abstraction: PropTypes.string,
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