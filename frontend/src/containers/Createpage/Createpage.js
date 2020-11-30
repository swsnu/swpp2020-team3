import React, {Component} from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import Select from 'react-select'
// Local imports
import './Createpage.css'
import * as actionCreators from '../../store/actions/index'
import PropTypes from "prop-types";

const checkOutput = (recipe) => {
    let message = ''
    if(recipe.title.length == 0)
        message = message.concat('제목을 입력해주세요.\n')
    if(recipe.thumbnail.length == 0)
        message = message.concat('대표사진을 추가해주세요.\n')
    if(recipe.duration.length == 0)
        message = message.concat('조리시간을 정해주세요.\n')
    if(recipe.ingredientList.length == 0)
        message = message.concat('최소한 하나의 요리재료를 추가해주세요.\n')
    if(recipe.descriptionList.length == 0)
        message = message.concat('조리 방법에 대한 설명을 추가해주세요.\n')
    
    return message
}

// I don't think we need createstep anymore --> delete it after verfication (end-to-end) test
class Createpage extends Component{
   state = {
       title:'',                        // must
       summary:'',                      // not must
       ingredient: '',                  
       duration: '',                    // not must
       category: [],                    // not must
       ////////
       descriptionList: [],             // must 
       imageList: [],                   
       imagePreviewList: [],            // not must
       ingredientList: [],              
       ingredientListSave: [],          
       selectedIngredientList: [],      // must
       //quantity: '',
       priceList: '',
       thumbnail: '',
       thumbnailURL: '',                // must
       // custom ingredient
        customIngrName: '',
        customIngrBrand: '',
        customIngrQuantity: 0,
        customIngrPrice: 0,
        customIngrType: 0
   }
   inputHandler = this.inputHandler.bind(this);
   imageHandler = this.imageHandler.bind(this);

    componentDidMount(){
        this.props.isLogin().then(res => {
            console.log(res.is_authenticated)
            if(!res.login_id){
                let input = window.confirm("로그인이 필요합니다. 로그인 하시겠습니까?");
                if(input){
                    this.props.history.push('/login')
                }
                else{
                    this.props.history.push('/main-page')
                }
            }
        })
        this.props.onGetIgrList().then(res => this.setState({ingredientListSave: res.ingredients, ingredientList: res.ingredients}))
    }

    inputHandler(event, index){
        let description = event.target.value
        let newList = this.state.descriptionList;
        newList[index] = description
        this.setState({descriptionList: newList})
        console.log(this.state.descriptionList)
    }
    imageHandler(event, index){
        let file = event.target.files[0]
        let reader = new FileReader();
        reader.onloadend = () => {
            let newImgList = this.state.imageList;
            let newPreviewList = this.state.imagePreviewList;
            newImgList[index] = file;
            newPreviewList[index] = reader.result
            this.setState({
                imageList: newImgList,
                imagePreviewList: newPreviewList
            })
        }
        reader.readAsDataURL(file)
    }
    thumbnailHandler(file){
        let reader = new FileReader();
        reader.onloadend = () => {
            this.setState({thumbnailURL: reader.result})
            this.setState({thumbnail: file})
        }
        reader.readAsDataURL(file)
    }

    addStepHandler(){
        let newList = this.state.descriptionList
        newList.push('')
        this.setState({descriptionList: newList})
    }
    deleteStepHandler(event){
        let index = event.target.index
        let newDList = this.state.descriptionList;
        let newIList = this.state.imageList;
        let newPList = this.state.imagePreviewList;
        newDList.splice(index, 1)
        newIList.splice(index, 1)
        newPList.splice(index, 1)
        this.setState({descriptionList: newDList})
        this.setState({imageList: newIList})
        this.setState({imagePreviewList: newPList})
    }

    submitHandler(){
        let state = this.state;
        let priceList = []
        let totalPrice = 0;
        let list = this.state.selectedIngredientList
        if(list.length > 0){
            console.log("larger")
            priceList = list.map((entry) => ({'price': entry.price, 'amount':entry.amount}))
            for(let i = 0; i < priceList.length; i++){
                totalPrice+=(priceList[i]['price']*priceList[i]['amount'])
            }
        }
        var today = new Date(),
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let recipe = {
            title: state.title,
            duration: state.duration,
            totalPrice: totalPrice,
            descriptionList: state.descriptionList,
            //imageList: state.imageList,
            category: state.category,
            prevList: state.imagePreviewList,
            summary: state.summary,
            ingredientList: state.selectedIngredientList,
            thumbnail: state.thumbnailURL,
            date: date
        }
        let pass = checkOutput(recipe);
        
        if(pass.length == 0)
            this.props.onCreate(recipe).then((res) => this.props.history.push('/detail-page/'+res.selectedRecipe.id))
        else console.log(pass)
    }
    
    onClickChangeColor(event, param){
        if (!this.state.category.includes(param)){
            event.target.style.backgroundColor = 'grey'
            this.setState({category: this.state.category.concat(param)})
        }
        else{
            event.target.style.backgroundColor = null
            this.setState({category: this.state.category.filter((type)=>{if(type!=param) return type})})
        }
    }

    addSelectedIngredientHandler(event){
        console.log("addselected")
        let list1 = this.state.selectedIngredientList.concat(event)
        this.setState({selectedIngredientList: list1})
        let list2 = this.state.ingredientListSave
        let list = list2.filter((ing) => {
            return !list1.includes(ing)
        })
        this.setState({ingredientList: list})
    }
    deleteSelectedIngredientHandler(index){
        console.log("delete")
        let newList = this.state.selectedIngredientList;
        let deleted = newList.splice(index, 1)
        this.setState({selectedIngredientList: newList})
        newList = this.state.ingredientList;
        newList = newList.concat(deleted[0])
        console.log(deleted[0])
        console.log(newList)
        this.setState({ingredientList: newList})
    }
    addIngredientQuantity(event, id){
        console.log("addingredient")
        let list = this.state.selectedIngredientList
        let amount = event.target.value
        console.log(amount)
        list[id]['amount'] = parseInt(amount)
        this.setState({selectedIngredientList: list})
    }
    addCustomIngredient(){
        console.log("addcustom")
        let customIngr = {
            brand: this.state.customIngrBrand,
            name: this.state.customIngrName,
            igd_type: this.state.customIngrType,
            price: this.state.customIngrPrice,
            quantity: this.state.customIngrQuantity,
            amount: 0,
        }
        let listSelected = this.state.selectedIngredientList
        let listTotal = this.state.ingredientListSave
        listSelected = listSelected.concat(customIngr)
        listTotal = listTotal.concat(customIngr)
        console.log(listSelected)
        console.log(listTotal)
        this.setState({selectedIngredientList: listSelected, ingredientListSave: listTotal, customIngrName: '', customIngrBrand: '',
        customIngrQuantity: 0, customIngrPrice: 0, customIngrType: 0})
    }


    render(){
        let displayStepList;
        if(this.state.descriptionList.length > 0){
        displayStepList = this.state.descriptionList.map((item, index) => (
            <div key={index} className="description-list">
                <textarea id='step-input' type="text" onChange={(event) => this.inputHandler(event, index)} value={this.state.descriptionList[index]} />
                <input id='step-image' type="file" accept='.jpg, .png, .jpeg' onChange={(event) => this.imageHandler(event, index)}/>
                <br/>
                <img src={this.state.imagePreviewList[index]} width='250' height='200'/>
                <button id="delete-step" onClick={(event) => this.deleteStepHandler(event)} index={index}>Delete step</button>
            </div>
        ))
                        }
        let selectedIngredientList;
        selectedIngredientList = this.state.selectedIngredientList.map((item, index) => (
            <div id='ingredient' key={index}>
                {item.brand}
                {item.name}
                {item.price}
                <input id={index} type='number' placeholder='양' value={this.state.selectedIngredientList[index].amount}
                    onChange={(event) => this.addIngredientQuantity(event, index)}/>
                {isNaN(item.amount * item.price) ? 0 : item.amount * item.price}
                <button className="deleteIngredient" onClick={() => this.deleteSelectedIngredientHandler(index)} index={index} > X </button>
            </div>
        ))
        let totalPrice = 0;
        let list = this.state.selectedIngredientList
        let priceList = []
        if(list.length > 0){
            priceList = list.map((entry) => ({'price': entry.price, 'amount':entry.amount}))
            for(let i = 0; i < priceList.length; i++){
                totalPrice+= isNaN(priceList[i]['price']*priceList[i]['amount'])? 0 : (priceList[i]['price']*priceList[i]['amount'])
            }
        }
        return(
            <div className="CreateBackground">
                <div className="CreatepageBlock">
                    <div className="Createpage">
                        <label> 레시피 등록 </label>
                        <br/>
                        <div className = 'create_first'>
                            <p>레시피 제목</p>
                            <input id="recipe-title-input" type='text' placeholder='Title' name='title' 
                            onChange={(event) => this.setState({title: event.target.value})}/>
                            <br/>
                            <p>레시피의 간단한 설명</p>
                            <input id="recipe-summary-input" type='text' placeholder='Summary' name='summary' 
                            onChange={(event) => this.setState({summary: event.target.value})}/>
                            <br/>

                            <p> 썸네일 사진 추가 </p>
                            <input id="recipe-thumbnail-input" type="file" accept='.jpg, .png, .jpeg'
                                onChange={(event) => this.thumbnailHandler(event.target.files[0])}/>
                            <img src={this.state.thumbnailURL} width='250' height='200' />
                            <br/>
                            
                            <p>재료 추가</p>
                            {/* {this.state.ingredientList == null
                            ? <Select options={this.props.ingredientList} 
                            getOptionLabel={option => `[${option.brand}] ${option.name} (${option.price}원 - normalized price)`}
                            onChange={(event) => this.addSelectedIngredientHandler(event)}
                            isSearchable={true} placeholder={'재료를 입력하시오.'} value='' autoFocus={true}/>
                            : <Select options={this.state.ingredientList}  */}
                            {<Select options={this.state.ingredientList}
                            getOptionLabel={option => `[${option.brand}] ${option.name} (${option.price}원 - normalized price)`}
                            onChange={(event) => this.addSelectedIngredientHandler(event)}
                            isSearchable={true} placeholder={'재료를 입력하시오.'} value='' autoFocus={true}/>}

                            {/* horizontal로 쭉 됐으면 함 */}
                            <div id="add-custom-ingredient">
                                <label>재료 이름</label>
                                <input type="text" value={this.state.customIngrName} onChange={(event) => this.setState({customIngrName: event.target.value})}/>
                                <label>브랜드명</label>
                                <input type="text" value={this.state.customIngrBrand} onChange={(event) => this.setState({customIngrBrand: event.target.value})}/>
                                <label>양 (상품)</label>
                                <input type="number" value={this.state.customIngrQuantity} onChange={(event) => this.setState({customIngrQuantity: event.target.value})}/>
                                <label>계량(igd_type)</label>
                                <input type="text" value={this.state.customIngrType} onChange={(event) => this.setState({customIngrType: event.target.value})}/>
                                <label>가격 (상품)</label>
                                <input type="number" value={this.state.customIngrPrice} onChange={(event) => this.setState({customIngrPrice: event.target.value})}/>
                                <button onClick={() => this.addCustomIngredient()}>재료 추가하기</button>
                            </div>

                            {selectedIngredientList}

                            <p>예상 조리 시간</p>
                            <input id="recipe-cooking-time-input" type='number' min="0"
                                value={this.state.value} onChange={(event) => this.setState({duration: event.target.value})} 
                                placeholder='minutes' name='cooking-time' />
                            {"  분"}
                        </div>
                        <br/>
                        <div className = 'create_second'>
                            <p>조리 방법</p>
                            {displayStepList}
                            <br/>
                            <button id='addStep' onClick={() => this.addStepHandler()}>Click to add a step</button>
                            <br/>
                        </div>
                        <br/>
                        <div className = 'create_third'>
                            <div className='buttons'>
                                <p>카테고리 선택</p>
                                <button id='type' className = "type_first" onClick={(event)=>this.onClickChangeColor(event, 'Korean')}>Korean</button>
                                <button id='type' onClick={(event)=>this.onClickChangeColor(event, 'American')}>American</button>
                                <button id='type' onClick={(event)=>this.onClickChangeColor(event, 'Japanese')}>Japanese</button>
                                <button id='type' onClick={(event)=>this.onClickChangeColor(event, 'Chinese')}>Chinese</button>
                                <button id='type' onClick={(event)=>this.onClickChangeColor(event, 'Mexican')}>Mexican</button>
                                <button id='type' onClick={(event)=>this.onClickChangeColor(event, 'Dessert')}>Dessert</button>
                            </div>
                        </div>
                        <div className = 'create_fourth'>
                            <p>총 예상 가격 :   </p>
                            <h3>계산된 가격</h3>
                            <p>{isNaN(totalPrice) ? 0 : totalPrice} 원</p>
                        </div>
                        <div className = 'create_fifth'>
                            <button id='submit' onClick={() => this.submitHandler()}>Submit</button>                        
                        </div>

                        <div className = 'footspace'><br/></div>
                        
                    </div>  
                </div>
            </div>   
        )
    }
}

const mapStateToProps = state => {
    return {
       ingredientList: state.rcp.ingredientList,
       login_id: state.user.login_id
    };
}
  
const mapDispatchToProps = dispatch => {
    return {
        onCreate: (recipe) => dispatch(actionCreators.createRecipe(recipe)),
        onGetIgrList: () => dispatch(actionCreators.getIngredients()),
        isLogin: () => dispatch(actionCreators.isLogin())
        }
    }

Createpage.propTypes = {
    history: PropTypes.object,
    ingredientList: PropTypes.array,
    onGetIgrList: PropTypes.func,
    onCreate: PropTypes.func,
};

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Createpage));

