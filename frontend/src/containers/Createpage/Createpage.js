import React, {Component} from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import Select from 'react-select'
// Local imports
import './Createpage.css'
import * as actionCreators from '../../store/actions/index'
import PropTypes from "prop-types";

// I don't think we need createstep anymore --> delete it after verfication (end-to-end) test
class Createpage extends Component{
   state = {
       title:'',
       summary:'',
       ingredient: '',
       duration: '',
       category: [],
       ////////
       descriptionList: [],
       imageList: [],
       imagePreviewList: [],
       ingredientList: null,
       selectedIngredientList: [],
       //quantity: '',
       priceList: '',
       thumbnail: '',
       thumbnailURL: ''
   }
   inputHandler = this.inputHandler.bind(this);
   imageHandler = this.imageHandler.bind(this);

    componentDidMount(){
        this.props.isLogin().then(res => {
            console.log(res.is_authenticated)
            if(!res.is_authenticated){
                let input = window.confirm("로그인이 필요합니다. 로그인 하시겠습니까?");
                if(input){
                    this.props.history.push('/login')
                }
                else{
                    this.props.history.push('/main-page')
                }
            }
        })
        this.props.onGetIgrList()
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
    deleteSelectedIngredientHandler(index){
        let newList = this.state.selectedIngredientList;
        let deleted = newList.splice(index, 1)
        this.setState({selectedIngredientList: newList})
        newList = this.state.ingredientList;
        newList.push(deleted[0])
        console.log(deleted[0])
        this.setState({ingredientList: newList})
    }
    addIngredientQuantity(event, id){
        let list = this.state.selectedIngredientList
        let amount = event.target.value
        // was this: removed because of lint
        // if(list[id]['amount']!=undefined){
        //     list[id]['amount'] = parseInt(amount)
        // }
        // else{
        //     list[id]['amount'] = parseInt(amount)
        // }
        console.log(amount)
        list[id]['amount'] = parseInt(amount)
        this.setState({selectedIngredientList: list})
    }


    render(){
        let displayStepList;
        if(this.state.descriptionList.length > 0){
        displayStepList = this.state.descriptionList.map((item, index) => (
            <div key={index} className="description-list">
                <textarea type="text" onChange={(event) => this.inputHandler(event, index)} value={this.state.descriptionList[index]} />
                <input type="file" accept='.jpg, .png, .jpeg' onChange={(event) => this.imageHandler(event, index)}/>
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
       is_authenticated: state.user.is_authenticated
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

