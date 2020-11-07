import React, {Component} from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
// Local imports
import './Createpage.css'
import * as actionCreators from '../../store/actions/index'
import CreateStep from './CreateStep';

// TODO: must retreive ingredients
// TODO: must resize image before previewing
// TODO: Now it renders with descriptionList. Instead make a single array where each element contains imageList,
//       descriptionList and imagePreviewList
// (?)TODO(?): abstract the add image part, but the problem is later, I will have to add a delete part...
// TODO: make ingredient component that displays icon, price and so on.
// TODO: delete step doesn't display the correct value
class Createpage extends Component{
   
   state = {
       title:'',
       summary:'',
       ingredient: '',
       duration: '',
       tagList: [],
       price: 3000,
       ////////
       descriptionList: [],
       imageList: [],
       imagePreviewList: [],
       selectedIngrList: [],
   }
   inputHandler = this.inputHandler.bind(this);
   imageHandler = this.imageHandler.bind(this);

   componentDidMount(){
       this.props.onGetIgrList()
   }

    inputHandler(params){
        let description = params['description']
        let index = params['index']
        let newList = this.state.descriptionList;
        newList[index] = description
        this.setState({descriptionList: newList})
        console.log(this.state)
    }
    imageHandler(params){
        let index = params['index']
        let file = params['file']
        let reader = new FileReader();
    // console.log(reader.readyState) // 0 is for empty, 1 is for loading, and 2 is for completed
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
        console.log(this.state)
    }

    addStepHandler(){
        let newList = this.state.descriptionList
        console.log(newList)
        newList.push('')
        console.log(newList)
        this.setState({descriptionList: newList})
    }
    deleteStepHandler(event){
        let index = event.target.index
        let newDList = this.state.descriptionList;
        let newIList = this.state.imageList;
        newDList.splice(index, 1)
        newIList.splice(index, 1)
        console.log(newDList)
        console.log(newIList)
        this.setState({descriptionList: newDList})
        this.setState({imageList: newIList})
    }

    submitHandler(){
        //this.props.history.push('/main-page');
        let state = this.state;
        let recipe = {
            title: state.title,
            duration: state.duration,
            price: state.price,
            descriptionList: state.descriptionList,
            imageList: state.imageList,
            tagList: state.tagList,
            prevList: state.imagePreviewList,
            ////
            summary: state.summary,
        }
        this.props.onCreate(recipe)
        console.log(this.state)
    }
    
    onClickChangeColor(event, param){
        if (!this.state.tagList.includes(param)){
            event.target.style.backgroundColor = 'grey'
            this.setState({tagList: this.state.tagList.concat(param)})
        }
        else{
            event.target.style.backgroundColor = null
            this.setState({tagList: this.state.tagList.filter((type)=>{if(type!=param) return type})})
        }
    }

    addSelectedIgdHandler(event){
        let param = event.target.value
        if (!this.state.selectedIngrList.includes(event.target.value)){
            this.setState({selectedIngrList: this.state.selectedIngrList.concat(param)})
        }
        else{
            this.setState({selectedIngrList: this.state.selectedIngrList.filter((igd)=>{if(igd!=param) return igd})})
        }
    }

    render(){
        let displayStepList;
        displayStepList = this.state.descriptionList.map((item, index) => (
            <div>
                {console.log(this.state.descriptionList[index])}
                <CreateStep data={item} event_text={this.inputHandler} event_image={this.imageHandler} index={index} 
                            value_text={this.state.descriptionList[index]}/>
                <img src={this.state.imagePreviewList[index]}/>
                <button onClick={(index) => this.deleteStepHandler(index)} index={index}>Delete step</button>
            </div>
        ))
        let displayIngredientList;
        displayIngredientList = this.state.selectedIngrList.map((item) => (
            <div id='ingredient'>
                {item}
            </div>
        ))
        console.log(this.state.ingredient)
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
                            <p>재료 추가</p>
                            <select name="Ingredients" id="ingredients" 
                                value={this.state.value} onChange={(event) => this.addSelectedIgdHandler(event)}>
                                <option id='ingredient' value="ramyun">라면</option>
                                <option id='ingredient' value="sausage">소시지</option>
                                <option id='ingredient' value="kimbap">삼각김밥</option>
                                <option id='ingredient' value="juice">쥬시클</option>
                            </select>
                            {displayIngredientList}
                            <br/>
                            <p>예상 조리 시간</p>
                            <input id="recipe-cooking-time-input" type='number' 
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
                                <button id='type' className = "type_first" onClick={(event)=>this.onClickChangeColor(event, 'Italian')}>Italian</button>
                                <button id='type' onClick={(event)=>this.onClickChangeColor(event, 'Korean')}>Korean</button>
                                <button id='type' onClick={(event)=>this.onClickChangeColor(event, 'Japanese')}>Japanese</button>
                                <button id='type' onClick={(event)=>this.onClickChangeColor(event, 'Chinese')}>Chinese</button>
                                <button id='type' onClick={(event)=>this.onClickChangeColor(event, 'Mexican')}>Mexican</button>
                                <button id='type' onClick={(event)=>this.onClickChangeColor(event, 'Moroccan')}>Moroccan</button>
                            </div>
                        </div>
                        <div className = 'create_fourth'>
                            <p>총 예상 가격 :   </p>
                            <h3>계산된 가격</h3>
                            <p>{this.state.price} 원</p>
                        </div>
                        <div className = 'create_fifth'>
                            <button id='submit' onClick={() => this.submitHandler()}>Submit</button>                        </div>

                        <div className = 'footspace'><br/></div>
                        
                    </div>  
                </div>
            </div>   
        )
    }
}

const mapStateToProps = state => {
    return {
       igrdList: state.rcp.ingredientList
    };
}
  
const mapDispatchToProps = dispatch => {
    return {
        onCreate: (recipe) => dispatch(actionCreators.createRecipe(recipe)),
        onGetIgrList: () => dispatch(actionCreators.getIngredients())
        }
    }

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Createpage));

