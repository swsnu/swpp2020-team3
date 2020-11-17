import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as actionCreators from '../../store/actions/index';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import Select from 'react-select'

// TODO: ingredientList must contain all the ingredients except those that are already used.
class EditDishResult extends Component {
    state = {
        title: this.props.recipe && this.props.recipe.title,
        price: this.props.recipe && this.props.recipe.price,
        likes: this.props.recipe && this.props.recipe.likes,
        rating: this.props.recipe && this.props.recipe.rating,
        tag_list: this.props.recipe && this.props.recipe.tag_list,
        abstraction: this.props.recipe && this.props.recipe.summary,
        selectedIngredientList: this.props.recipe && this.props.recipe.ingredient_list,
        tags: this.props.recipe && this.props.recipe.tag_list,
        thumbnail_preview: this.props.recipe && 'data:image/png;base64,'+ this.props.recipe.thumbnail,

        ingredientList: this.props.ingredientList,
    }

    componentDidMount(){
        this.props.getRecipe(parseInt(this.props.match.params.id)).then((res) => {
            res = res.selectedRecipe
            this.setState({
            title: res.title,
            price: res.price,
            likes: res.likes,
            rating: res.rating,
            tag_list: res.tag_list,
            summary: res.summary,
            selectedIngredientList: res.ingredient_list,
            tags: res.tag_list,
            thumbnail_preview: 'data:image/png;base64,'+ res.thumbnail,
        })});
        this.props.onGetIgrList().then((res) => {
            this.setState({ingredientList: res.ingredients})
        })
    }

    updateState(key, value){
        this.props.updateState(key, value)
    }

    imageHandler(event){
        let file = event.target.files[0]
        let reader = new FileReader();
        reader.onloadend = () => {
            this.updateState('thumbnail', reader.result)
            this.setState({thumbnail_preview: reader.result})
            this.setState({thumbnail_file: file})
        }
        reader.readAsDataURL(file)
    }
    changeTitle(event){
        this.setState({title: event.target.value})
        this.updateState('title', event.target.value)
    }
    changeCategory(event){
        this.setState({category: event.target.value})
        this.updateState('category', event.target.value)
    }
    changeSummary(event){
        this.setState({summary: event.target.value})
        this.updateState('summary', event.target.value)
    }
    calculatePrice(){
        let totalPrice = 0;
        let list = this.state.selectedIngredientList
        let priceList = []
        if(list && list.length > 0){
            priceList = list.map((entry) => ({'price': entry.price, 'amount':entry.amount}))
            for(let i = 0; i < priceList.length; i++){
                if(priceList[i]['amount']){
                    totalPrice+=(priceList[i]['price']*priceList[i]['amount'])
                }
            }
        }
        return totalPrice
    }
    addIngredientQuantity(event, id){
        let list = this.state.selectedIngredientList
        let amount = event.target.value
        list[id]['amount'] = parseInt(amount)
        this.setState({selectedIngredientList: list})
        this.updateState('ingredient_list', list)
        let price = this.calculatePrice()
        this.updateState('price', price)
    }
    deleteSelectedIngredientHandler(index){
        let newList = this.state.selectedIngredientList;
        let deleted = newList.splice(index, 1)
        this.setState({selectedIngredientList: newList})
        this.updateState('ingredient_list', newList)
        newList = this.state.ingredientList;
        
        newList.push(deleted[0])
        this.setState({ingredientList: newList})

        let price = this.calculatePrice()
        this.updateState('price', price)
    }
    addSelectedIngredientHandler(event){
        if(this.state.ingredientList == null){
            this.setState({ingredientList: this.props.ingredientList})
        }
        let list1 = this.state.selectedIngredientList.concat(event)
        this.setState({selectedIngredientList: list1})
        this.updateState('ingredient_list', list1)
        let list2 = this.props.ingredientList
        let list = list2.filter((ing) => {
            return !list1.includes(ing)
        })
        this.setState({ingredientList: list})

        let price = this.calculatePrice()
        this.updateState('price', price)
    }
    changeCategory(event){
        let list = []
        list = event.map((val) => val['label'])
        this.setState({tag_list: list})
        this.updateState('tag_list', list)
    }

    render() {
        let thumbnail = this.state.thumbnail_preview ? <img src={this.state.thumbnail_preview} width='250' height='200' /> : null;
        let selectedIngredientList;
        if(this.state.selectedIngredientList){
            selectedIngredientList = this.state.selectedIngredientList.map((item, index) => (
                <div id='ingredient' key={index}>
                    <label>{item.brand} | </label>
                    <label>{item.name} | </label>
                    <label>{item.price} | </label>
                    <label>{item.amount}</label>
                    <input id={index} type='number' placeholder='양' value={this.state.selectedIngredientList[index].amount}
                        onChange={(event) => this.addIngredientQuantity(event, index)}/>
                    {isNaN(item.amount * item.price) ? 0 : item.amount * item.price}
                    <button className="deleteIngredient" onClick={() => this.deleteSelectedIngredientHandler(index)} index={index} > X </button>
                </div>
            ))
        }
        let totalPrice = 0;
        let list = this.state.selectedIngredientList
        let priceList = []
        if(list && list.length > 0){
            priceList = list.map((entry) => ({'price': entry.price, 'amount':entry.amount}))
            for(let i = 0; i < priceList.length; i++){
                if(priceList[i]['amount']){
                    totalPrice+=(priceList[i]['price']*priceList[i]['amount'])
                }
            }
        }

        const categoryOptions = [{value: 'American', label: 'American'}, {value: 'Mexican', label: 'Mexican'}, {value: 'Korean', label: 'Korean'},
        {value: 'Chinese', label: 'Chinese'}, {value: 'Japanese', label: 'Japanese'},{value: 'Dessert', label: 'Dessert'}]
        let defaultOptions = [];
        if(this.state.tag_list){
            for(let i = 0; i<this.state.tag_list.length; i++){
                for(let j = 0; j<categoryOptions.length; j++){
                    if(categoryOptions[j].value == this.state.tag_list[i])
                        defaultOptions.push(categoryOptions[j])
                }
            }
        }

        return (
            <div className='dish_result'>
                <div id = 'detailbox1'>
                    <div id = 'detailbox1area1'>
                        <div className = "area1text">
                            <input id='detailtitle' value={this.state.title} onChange={(event) => {this.changeTitle(event)}}/>
                            <br/>
                            <div id = 'detailinfo'>
                                <p id='detaillabel'>{'가격'}</p>
                                <label>{this.state.price} | </label>
                                <label>{isNaN(totalPrice) ? 0 : totalPrice} 원</label>
                                <br/>
                                <p id='detaillabel'>{'추천수'}</p>
                                {this.state.likes}
                                <br/>
                                <p id='detaillabel'>{'평점'}</p>
                                {this.state.rating}
                                <br/>
                                <p id='detaillabel'>{'카테고리'}</p>
                                <Select defaultValue={defaultOptions} isMulti name="category" options={categoryOptions} 
                                className="select-category" onChange={(event) => {this.changeCategory(event)}}/>
                                <input id='detailcategory' value={this.state.category} onChange={(event) => {this.changeCategory(event)}}/>
                                <br/>
                                <p id='detaillabel'>{'태그'}</p>
                                {/* {tag} */}
                            </div>
                        </div>
                        <div id = 'detailthumbnail'>
                            {thumbnail}
                            <input type="file" accept='.jpg, .png, .jpeg' onChange={(event) => this.imageHandler(event)}/>
                        </div>
                    </div>
                    <div id = 'detailtitle2'>{'레시피 간단 설명'}</div>
                    <div id = 'detailsummary'>
                        <textarea id='detailabstraction' value={this.state.summary} onChange={(event) => {this.changeSummary(event)}}/>
                    </div>
                </div>
                <div id = 'detailbox2'>
                    <div id = 'detailtitle3'>{'레시피 재료'}
                        {this.state.ingredientList == null
                        ? <Select options={this.props.ingredientList} 
                        getOptionLabel={option => `[${option.brand}] ${option.name} (${option.price}원 - normalized price)`}
                        onChange={(event) => this.addSelectedIngredientHandler(event)}
                        isSearchable={true} placeholder={'재료를 입력하시오.'} value='' autoFocus={true}/>
                        : <Select options={this.state.ingredientList} 
                        getOptionLabel={option => `[${option.brand}] ${option.name} (${option.price}원 - normalized price)`}
                        onChange={(event) => this.addSelectedIngredientHandler(event)}
                        isSearchable={true} placeholder={'재료를 입력하시오.'} value='' autoFocus={true}/>}

                        {selectedIngredientList}
                    
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