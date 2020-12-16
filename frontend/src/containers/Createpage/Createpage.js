import React, {Component} from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import Select from 'react-select'
// Local imports
import './Createpage.css'
import * as actionCreators from '../../store/actions/index'
import PropTypes from "prop-types";

const checkIngredients = (list) => {
    for(let i =0; i<list.length; i++){
        let item = list[i]
        console.log(item)
        if(item.price_normalized){ // ideal
            if(item.price!=0 && item.name.length != 0  && item.igd_type != '' && item.amount != 0 && item.quantity !=0)
                continue;
            else{
                console.log('dd')
                return false;
            } 
        }
        else{
            if(item.price != 0 && item.name.length != 0 && item.igd_type != '' && item.amount != 0){
                console.log('dsd')
                continue;
            }
            else {
                console.log("dsadj")
                return false;
            }
        }
    } 
    return true;
}

const checkDescriptions = (steps, images) => {
    // images < desc ==> false
    let message = ''
    if(images.length < steps.length){
        message += '조리 방법에 대한 이미지를 삽입해주세요.\n'
    }
    for(let i = 0; i<steps.length; i++){
        if(steps[i].length==0){
            message += '조리 방법에 대한 설명을 추가해주세요.\n'
            return message;
        }
    }
    return message;
    
    // // desc empty ==> false
    // // desc.length == images.length + 각각의 스텝이 비어있으면 안 됨.
    // console.log(steps.length)
    // console.log(images.length)
    
    // return true
}

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
    if(recipe.descriptionList.length != 0)
        message = message.concat(checkDescriptions(recipe.descriptionList, recipe.prevList))
    if(recipe.ingredientList.length != 0 && !checkIngredients(recipe.ingredientList))
        message = message.concat('요리재료를 올바르게 채워주세요.')
    if(!recipe.category.length)
	message = message.concat('카테고리를 골라주세요.')
    console.log(message)
    return message
}

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
                console.log(item)
                let parsed = parseFloat(item.amount * (item.quantity == 0 ? 0 : item.price/item.quantity).toFixed(2)).toFixed(2)
                let add = flag == 0 ? price : parsed
                totalPrice = parseFloat(totalPrice) + parseFloat(add)
                console.log(totalPrice.toFixed(2))
            }
        }
    return totalPrice
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
        // customIngrName0: '',
        customIngrBrand: '',
        customIngrQuantity: 0,
        customIngrPrice: 0,
        customIngrNormPrice: 0, // 3번 타입의 재료를 위한 제품의 총 가격 변수 - 호환을 위해 hardPrice 말고 NormPrice라고 함.
        // customIngrType1: 'g',
        customIngrType: 'g',


        detailed: false,
   }
   inputHandler = this.inputHandler.bind(this);
   imageHandler = this.imageHandler.bind(this);

    componentDidMount(){
        this.props.isLogin().then(res => {
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
    deleteStepHandler(event, index){
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

        let totalPrice = totalPriceCalculator(this.state.selectedIngredientList);
    
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
	    console.log("hell");
        if(pass){
            window.alert(pass);
            return;
        }
	    console.log(this.props.onCreate(recipe));
        this.props.onCreate(recipe).then((res) => this.props.history.push('/detail-page/'+res.selectedRecipe.id))

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
        event.amount = 0
        let list1 = this.state.selectedIngredientList.concat(event)
        this.setState({selectedIngredientList: list1})
        let list2 = this.state.ingredientListSave
        let list = list2.filter((ing) => {
            return !list1.includes(ing)
        })
        this.setState({ingredientList: list})
    }
    deleteSelectedIngredientHandler(index){
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
        let list = this.state.selectedIngredientList
        let amount = event.target.value
        console.log(event.target.value)
        list[id]['amount'] = parseInt(amount)
        this.setState({selectedIngredientList: list})
    }
    addCustomIngredient(){
        let show = this.state.detailed ? 1 : 0     // 0: 간단 재료, 1: 상세 재료
        let ingrPrice = this.state.customIngrPrice!=undefined ? this.state.customIngrPrice : 0
        let customIngr = {
            brand: this.state.customIngrBrand,
            name: this.state.customIngrName,
            igd_type: this.state.customIngrType,
            price_normalized: show,  
            price: show == 1 ? parseInt(ingrPrice) : parseInt(this.state.customIngrNormPrice),
            quantity: parseFloat(this.state.customIngrQuantity),   // 0: 간단, != 0: 상세
            amount: 0,
        }
        console.log(customIngr.price)
        let message = '';
        if(show == 1 && !customIngr.brand){
            message += '상세 선택 시 재료의 브랜드를 입력해주세요.\n'
        }
        if(!customIngr.name){
            message += '재료의 이름를 입력해주세요.\n'
        }
        if(show == 1 && customIngr.quantity==0){
            message += '상세 선택 시 상품의 양을 정확하게 입력해주세요.\n'
        }
        if(!customIngr.igd_type){
            message += '재료의 단위를 입력해주세요.\n'
        }
        // can be zero (예: 소금, 후추, 물... 이런건 추가할때 가격 메기기 힘들듯)
        // if(!customIngr.price){ 
        //     message += '재료의 가격을 입력해주세요.\n'
        // }
        if(message){
            window.alert(message);
            return;
        }
        console.log(customIngr)
        let listSelected = this.state.selectedIngredientList
        let listTotal = this.state.ingredientListSave
        listSelected = listSelected.concat(customIngr)
        listTotal = listTotal.concat(customIngr)
        this.setState({selectedIngredientList: listSelected, ingredientListSave: listTotal, customIngrName: '', customIngrBrand: '',
        customIngrQuantity: 0, customIngrPrice: 0,  customIngrNormPrice: 0, customIngrType: 'g'})
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
                <button id="delete-step" onClick={(event) => this.deleteStepHandler(event, index)} >Delete step</button>
            </div>
        ))
                        }
        let selectedIngredientList;
        // item.price/item.quantity 대신에 원래는 price_normalized 사용해야하는데, 그러고 위해서는 views를 고쳐야함
        selectedIngredientList = this.state.selectedIngredientList.map((item, index) => (
            <div id='ingredient' key={index}>
                {item.brand} {" | "}
                {item.name} {" | "}
                {console.log(item)}
                {item.price_normalized == 0 ? (item.price == undefined ? 0 : item.price) 
                    : (parseFloat((item.quantity == 0 ? 0 : parseFloat((item.price/item.quantity).toFixed(2)).toFixed(2))).toFixed(2))} 
                {`per  ${item.igd_type} | `}
                <input id={index} type='number' min="0" placeholder='양' value={this.state.selectedIngredientList[index].amount}
                    onChange={(event) => this.addIngredientQuantity(event, index)}/>
                {item.igd_type} {" | "}
                {
                item.price_normalized == 0 ? item.price :
                parseFloat(item.amount * (item.quantity == 0 ? 0 : parseFloat((item.price/item.quantity).toFixed(2)).toFixed(2))).toFixed(2)}

                <button className="deleteIngredient" onClick={() => this.deleteSelectedIngredientHandler(index)} index={index} > X </button>
            </div>
        ))
        let totalPrice = totalPriceCalculator(this.state.selectedIngredientList)
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
                            <textarea id="recipe-summary-input" type='text' placeholder='Summary' name='summary' 
                            onChange={(event) => this.setState({summary: event.target.value})}/>
                            <br/>

                            <p> 썸네일 사진 추가 </p>
                            <input id="recipe-thumbnail-input" type="file" accept='.jpg, .png, .jpeg'
                                onChange={(event) => this.thumbnailHandler(event.target.files[0])}/>
                            <img src={this.state.thumbnailURL} width='250' height='200' />
                            <br/>

                            <p>예상 조리 시간</p>
                            <input id="recipe-cooking-time-input" type='number' min="0"
                                value={this.state.value} onChange={(event) => this.setState({duration: event.target.value})} 
                                placeholder='minutes' name='cooking-time' />
                            {"  분"}
                            
                            {/* <h4>재료 추가</h4>
                            <p>레시피에 필요한 재료를 추가해주세요! 선택란에 없다면 직접 추가하실 수 있습니다.</p>
                            <p>사용하시는 재료가 특정 브랜드의 상품이 아니고 신선한 재료라면 (야채, 과일...) 재료명과 '제품'의 가격을 입력해주세요!</p>
                            <p>양 (상품) 칸에는 특정 브랜드의 상품을 입력할때만 사용해주세요! 즉, 시중에 파는 상품이 아니면 건너뛰시면 됩니다!</p>
                            <p>할 수 있다면 사용하시는 브랜드의 명과 상품의 가격 및 총량을 입력해주세요. 입력하기 귀찮으시다면 위처럼 재료명과 가격('제품'칸)에 입력해주세요.</p>
                            <p>제품칸에 입력을 안 하시고 상품칸에 재료의 가격을 입력하게 된다면 실제 가격보다 훨씬 더 많이 측정이 됩니다 ㅠㅠ</p>
                            <p>둘 다 입력하게 되면 '제품' 칸이 채워진거기 때문에 제품의 가격이 먹힙니다.</p>
                            <br/> */}

                            {<Select options={this.state.ingredientList.filter((item) => item.brand!='')}
                            getOptionLabel={option => `[${option.brand}] ${option.name} (${option.price}원 - ${option.price == 0 ? '?' 
                                        : (option.quantity == 0 ? 0 : option.price/option.quantity).toFixed(2)}원/${option.price == 0 ? '?': option.igd_type})`}
                            onChange={(event) => this.addSelectedIngredientHandler(event)}
                            isSearchable={true} placeholder={'재료를 입력하시오.'} value=''/>}
                            {/* horizontal로 쭉 됐으면 함 */}
                            <div id="add-custom-ingredient">
                                <p>재료 이름</p>
                                <input className='ingr_name' type="text" value={this.state.customIngrName} onChange={(event) => this.setState({customIngrName: event.target.value})}/>
                                <br/>
                                <p>계량(igd_type)</p>
                                <input className='ingr_type' type="text" value={this.state.customIngrType} placeholder="g, ml..." onChange={(event) => this.setState({customIngrType: event.target.value})}/>
                                <br/>
                                <p>가격 (실제 사용된 만큼의 재료의 가격)</p>
                                <input className='ingr_price_1' type="number" value={this.state.customIngrNormPrice} onChange={(event) => this.setState({customIngrNormPrice: event.target.value})}/>
                                <br/>
                                <br/>
                                
                                <button className='ingr_detailed' onClick={() => this.setState({detailed: !this.state.detailed})}>상품 상세 </button>
                                <br/>
                                {
                                    (this.state.detailed == true 
                                        ? <div>
                                            <p>브랜드명</p>
                                            <input type="text" className='ingr_brand' value={this.state.customIngrBrand} onChange={(event) => this.setState({customIngrBrand: event.target.value})}/>
                                            <br/>
                                            <p>상품의 제조량</p>
                                            <input type="number" className='ingr_quantity' value={this.state.customIngrQuantity} onChange={(event) => this.setState({customIngrQuantity: event.target.value})}/>
                                            <br/>
                                            <p>상품의 가격</p>
                                            <input type="number" className='ingr_price_0' value={this.state.customIngrPrice} onChange={(event) => this.setState({customIngrPrice: event.target.value})}/>
                                          </div> 
                                        : <div></div>)
                                }
                                <br/>
                                <button className='ingr_submit_0' onClick={() => this.addCustomIngredient(this.state.detailed)}>재료 추가하기</button>
                                
                            </div>

                            {selectedIngredientList}

                            
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
                                <button id='type' className = "type_first" style={(this.state.category.includes('Chinese')?{'background-color':'#c2563a'}:null)} onClick={(event)=>this.onClickChangeColor(event, 'Chinese')}>중식</button>
                                <button id='type' style={(this.state.category.includes('Korean')?{'background-color':'#c2563a'}:null)} onClick={(event)=>this.onClickChangeColor(event, 'Korean')}>한식</button>
                                <button id='type' style={(this.state.category.includes('American')?{'background-color':'#c2563a'}:null)} onClick={(event)=>this.onClickChangeColor(event, 'American')}>양식</button>
                                <button id='type' style={(this.state.category.includes('Japanese')?{'background-color':'#c2563a'}:null)} onClick={(event)=>this.onClickChangeColor(event, 'Japanese')}>일식</button>
                                <button id='type' style={(this.state.category.includes('Dessert')?{'background-color':'#c2563a'}:null)} onClick={(event)=>this.onClickChangeColor(event, 'Dessert')}>디저트</button>
                                <button id='type' style={(this.state.category.includes('ConvenienceStore')?{'background-color':'#c2563a'}:null)} onClick={(event)=>this.onClickChangeColor(event, 'ConvenienceStore')}>편의점</button>
                            </div>
                        </div>
                        <div className = 'create_fourth'>
                            <p>총 예상 가격 :   </p>
                            <h3>계산된 가격</h3>
                            <p>{}</p>
                            <p>{isNaN(totalPrice) ? 0 : parseFloat(totalPrice)} 원</p>
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


