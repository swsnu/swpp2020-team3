import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as actionCreators from '../../store/actions/index';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import Select from 'react-select'
import './EditDishResult.css'
// TODO: ingredientList must contain all the ingredients except those that are already used.

const totalPriceCalculator = (list ) => {
    let totalPrice = 0;
        // let list = this.state.selectedIngredientList
        let priceList = []
        if(list.length > 0){
            priceList = list.map((entry) => ({'price': entry.price, 'amount':entry.amount, 'quantity': entry.quantity, 'price_normalized': entry.price_normalized}))
            for(let i = 0; i < priceList.length; i++){
                let item = priceList[i]

                let price = item.price ? item.price : 0
                let flag = item.price_normalized
                let parsed = parseFloat(item.amount * (item.quantity == 0 ? 0 : item.price/item.quantity).toFixed(2)).toFixed(2)
                let add = flag == 0 ? price : parsed
                totalPrice = parseFloat(totalPrice) + parseFloat(add)
            }
        }
    return totalPrice
}

class EditDishResult extends Component {
    state = {
        title: this.props.recipe && this.props.recipe.title,
        price: this.props.recipe && this.props.recipe.price,
        duration: this.props.recipe && this.props.recipe.duration,
        likes: this.props.recipe && this.props.recipe.likes,
        rating: this.props.recipe && this.props.recipe.rating,
        category: this.props.recipe && this.props.recipe.category,
        abstraction: this.props.recipe && this.props.recipe.summary,
        selectedIngredientList: this.props.recipe && this.props.recipe.ingredient_list,
        thumbnail_preview: this.props.recipe && 'data:image/png;base64,'+ this.props.recipe.thumbnail,

        ingredientListSave: this.props.ingredientList,
        ingredientList: [],
        // custom ingredient
        customIngrName1: '',
        customIngrName0: '',
        customIngrBrand: '',
        customIngrQuantity: 0,
        customIngrPrice: 0,
        customIngrNormPrice: 0, // 3번 타입의 재료를 위한 제품의 총 가격 변수 - 호환을 위해 hardPrice 말고 NormPrice라고 함.
        customIngrType1: 'g',
        customIngrType0: 'g'

    }

    componentDidMount(){
        this.props.getRecipe(parseInt(this.props.match.params.id)).then((res1) => {
            res = res1.selectedRecipe
            this.setState({
            title: res.title,
            price: res.price,
            duration: res.duration,
            likes: res.likes,
            rating: res.rating,
            category: res.category,
            summary: res.summary,
            selectedIngredientList: res.ingredient_list,
            thumbnail_preview: 'data:image/png;base64,'+ res.thumbnail,
        })});
        this.props.onGetIgrList().then((res) => {
            this.setState({ingredientListSave: res.ingredients, ingredientList: res.ingredients})
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
    changeDuration(event){
        this.setState({duration: event.target.value})
        this.updateState('duration', event.target.value)
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
        this.setState({ingredientListSave: newList})

        let price = this.calculatePrice()
        this.updateState('price', price)
    }
    addSelectedIngredientHandler(event){
        /*if(this.state.ingredientList == null){
            this.setState({ingredientList: this.props.ingredientList})
        }*/
        event.amount = 0
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
    onClickChangeColor(event, param){
        if (!this.state.category.includes(param)){
            event.target.style.backgroundColor = 'grey'
            const newlist =  this.state.category.concat(param)
            this.setState({category: newlist})
            this.updateState('category', newlist)
        }
        else{
            event.target.style.backgroundColor = null
            const newlist = this.state.category.filter((type)=>{if(type!=param) return type})
            this.setState({category: newlist})
            this.updateState('category', newlist)
        }
    }
    addCustomIngredient(show){
        let ingrPrice = this.state.customIngrPrice!=undefined ? this.state.customIngrPrice : 0
        let customIngr = {
            brand: this.state.customIngrBrand,
            name: this.state.customIngrName1 ? this.state.customIngrName1 : this.state.customIngrName0,
            igd_type: this.state.customIngrType1==this.state.customIngrType0 ? 'g' 
                        : (this.state.customIngrType1!='g'? this.state.customIngrType1 : this.state.customIngrType0),
            price_normalized: show,
            price: show == 1 ? parseInt(ingrPrice) : parseInt(this.state.customIngrNormPrice),
            quantity: parseFloat(this.state.customIngrQuantity),
            amount: 0,
        }
        let listSelected = this.state.selectedIngredientList
        let listTotal = this.state.ingredientListSave
        listSelected = listSelected.concat(customIngr)
        listTotal = listTotal.concat(customIngr)
        this.setState({selectedIngredientList: listSelected, ingredientListSave: listTotal, customIngrName1: '', customIngrName0: '', customIngrBrand: '',
        customIngrQuantity: 0, customIngrPrice: 0,  customIngrNormPrice: 0, customIngrType1: 'g', customIngrType0: 'g'})
    }


    render() {
        let thumbnail = this.state.thumbnail_preview ? <img src={this.state.thumbnail_preview} width='350' height='280' /> : null;
        let selectedIngredientList;
        let totalPrice = 0;
        if(this.state.selectedIngredientList){
            selectedIngredientList = this.state.selectedIngredientList.map((item, index) => (
                <div id='ingredient' key={index}>
                    {item.brand} {" | "}
                    {item.name} {" | "}
                    {item.price_normalized == 0 ? (item.price == undefined ? 0 : item.price) 
                        : (parseFloat((item.quantity == 0 ? 0 : parseFloat((item.price/item.quantity).toFixed(2)).toFixed(2))).toFixed(2))} 
                    {`per  ${item.igd_type} | `}
                    <input id={index} type='number' min="0" placeholder='양' value={this.state.selectedIngredientList[index].amount}
                        onChange={(event) => this.addIngredientQuantity(event, index)}/>
                    {item.igd_type} {" | "}
                    {item.price_normalized == 0 ? item.price :
                    parseFloat(item.amount * (item.quantity == 0 ? 0 : parseFloat((item.price/item.quantity).toFixed(2)).toFixed(2))).toFixed(2)}
                    <button className="deleteIngredient" onClick={() => this.deleteSelectedIngredientHandler(index)} index={index} > X </button>
                </div>
            ))
            totalPrice = totalPriceCalculator(this.state.selectedIngredientList)
        }        

        const categoryOptions = [{value: 'American', label: 'American'}, {value: 'Mexican', label: 'Mexican'}, {value: 'Korean', label: 'Korean'},
        {value: 'Chinese', label: 'Chinese'}, {value: 'Japanese', label: 'Japanese'},{value: 'Dessert', label: 'Dessert'}]
        let defaultOptions = [];
        if(this.state.category){
            for(let i = 0; i<this.state.category.length; i++){
                for(let j = 0; j<categoryOptions.length; j++){
                    if(categoryOptions[j].value == this.state.category[i])
                        defaultOptions.push(categoryOptions[j])
                }
            }
        }
        return (
            <div className='dish_result'>
                <div id = 'detailbox1'>
                    <div id = 'detailbox1area1'>
                        <div className = "area1text1">
                            <input id='detailtitle' value={this.state.title} onChange={(event) => {this.changeTitle(event)}}/>
                            <br/>
                            <div id = 'detailinfo'>
                                <p id='detaillabel'>{'가격'}</p>
                                <label>{this.state.price} | </label>
                                <label>{isNaN(totalPrice) ? 0 : totalPrice.toFixed(2)} 원</label>
                                <br/>
                                <p id='detaillabel'>{'추천수'}</p>
                                {this.state.likes}
                                <br/>
                                <p id='detaillabel'>{'평점'}</p>
                                {this.state.rating}
                                <br/>
                                <p id='detaillabel'>{'시간'}</p>
                                <input id="recipe-cooking-time-input" type='number' min="0"
                                value={this.state.duration} onChange={(event) => this.changeDuration(event)} 
                                placeholder='minutes' name='cooking-time' />
                                {"  분"}
                                <br/>
                                <p id='detaillabel'>{'카테고리'}</p>
                                <button id='type' className = "type_first" style = {{background: (this.state.category&&this.state.category.includes('Korean'))&&'grey'}} 
                                                    onClick={(event)=>this.onClickChangeColor(event, 'Korean')}>Korean</button>
                                <button id='type' style = {{background: (this.state.category&&this.state.category.includes('American'))&&'grey'}} 
                                                    onClick={(event)=>this.onClickChangeColor(event, 'American')}>American</button>
                                <button id='type' className = 'type_second' style = {{background: (this.state.category&&this.state.category.includes('Japanese'))&&'grey'}} 
                                                    onClick={(event)=>this.onClickChangeColor(event, 'Japanese')}>Japanese</button>
                                <button id='type' style = {{background: (this.state.category&&this.state.category.includes('Chinese'))&&'grey'}} 
                                                    onClick={(event)=>this.onClickChangeColor(event, 'Chinese')}>Chinese</button>
                                <br/>
                                <button id='type' className = "type_second" style = {{background: (this.state.category&&this.state.category.includes('Mexican'))&&'grey'}} 
                                                    onClick={(event)=>this.onClickChangeColor(event, 'Mexican')}>Mexican</button>
                                <button id='type' style = {{background: (this.state.category&&this.state.category.includes('Dessert'))&&'grey'}} 
                                                    onClick={(event)=>this.onClickChangeColor(event, 'Dessert')}>Dessert</button>
                                <br/>
                            </div>
                        </div>
                        <div id = 'detailthumbnail'>
                            {thumbnail}
                            <input id="imageHandler" type="file" accept='.jpg, .png, .jpeg' onChange={(event) => this.imageHandler(event)}/>
                        </div>
                    </div>
                    <div id = 'detailtitle2'>{'레시피 간단 설명'}</div>
                    <div id = 'detailsummary'>
                        <textarea id='detailabstraction' value={this.state.summary} onChange={(event) => {this.changeSummary(event)}}/>
                    </div>
                </div>
                <div id = 'detailbox2'>
                    <div id = 'detailtitle3'>
                        {'레시피 재료'}
                        <br/>
                        <div id='detailingre'>
                            {<Select options={this.state.ingredientList}
                            getOptionLabel={option => `[${option.brand}] ${option.name} (${option.price}원 - ${option.price == 0 ? '?' 
                                        : (option.quantity == 0 ? 0 : option.price/option.quantity).toFixed(2)}원/${option.price == 0 ? '?': option.igd_type})`}
                            onChange={(event) => this.addSelectedIngredientHandler(event)}
                            isSearchable={true} placeholder={'재료를 입력하시오.'} value='' autoFocus={true}/>}

                            <div id="add-custom-ingredient">
                                <div id="add-custom-detailed">
                                    <label>엄밀</label>
                                    <label>재료 이름</label>
                                    <input type="text" value={this.state.customIngrName1} onChange={(event) => this.setState({customIngrName1: event.target.value})}/>
                                    <label>브랜드명</label>
                                    <input type="text" value={this.state.customIngrBrand} onChange={(event) => this.setState({customIngrBrand: event.target.value})}/>
                                    <label>양 (상품)</label>
                                    <input type="number" value={this.state.customIngrQuantity} onChange={(event) => this.setState({customIngrQuantity: event.target.value})}/>
                                    <label>계량(igd_type)</label>
                                    <input type="text" value={this.state.customIngrType1} onChange={(event) => this.setState({customIngrType1: event.target.value})}/>
                                    <label>가격 (상품)</label>
                                    <input type="number" value={this.state.customIngrPrice} onChange={(event) => this.setState({customIngrPrice: event.target.value})}/>
                                    <button onClick={() => this.addCustomIngredient(1)}>재료 추가하기</button>
                                </div>
                                <br/>
                                <div id="add-custom-simple">
                                    <label>간단</label>
                                    <label>재료 이름</label>
                                    <input type="text" value={this.state.customIngrName0} onChange={(event) => this.setState({customIngrName0: event.target.value})}/>
                                    <label>계량(igd_type)</label>
                                    <input type="text" value={this.state.customIngrType0} placeholder="g, ml..." onChange={(event) => this.setState({customIngrType0: event.target.value})}/>
                                    <label>가격 (제품)</label>
                                    <input type="number" value={this.state.customIngrNormPrice} onChange={(event) => this.setState({customIngrNormPrice: event.target.value})}/>
                                    <button onClick={() => this.addCustomIngredient(0)}>재료 추가하기</button>
                                </div>
                            </div>

                            <div id='selected'>
                                {selectedIngredientList}
                            </div>
                        </div>
                    
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