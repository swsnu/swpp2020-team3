import React, {Component} from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
// Local imports
import CreateStep from '../../components/CreateStep'
import './Createpage.css'
import * as actionCreators from '../../store/actions/index'

class Createpage extends Component{
    state = {
        CreateStepList: [],
        typeList: [],
        title: "",
        summary: "",
        ingredient: [],
        time: "",
        price: 10000, //normally should be calculated
        redirect: false
    }
    //must retreive ingredients

    onClickAddStep(){
        var tempList = this.state.CreateStepList.concat(<CreateStep/>)
        this.setState({CreateStepList: tempList})       
    }

    onClickChangeColor(event, param){
        if (!this.state.typeList.includes(param)){
            event.target.style.backgroundColor = 'grey'
            this.setState({typeList: this.state.typeList.concat(param)})
        }
        else{
            event.target.style.backgroundColor = null
            this.setState({typeList: this.state.typeList.filter((type)=>{if(type!=param) return type})})
        }
    }

    onClickSubmit(){
        this.props.history.push('/main-page');
        var finalRecipe = {
            'title': this.state.title,
            'summary': this.state.summary,
            
        }
        this.props.onCreate(this.state)
        this.setState({redirect: true})
    }

    render(){
        return(
            <div className = "CreateBackground">
                <div className = 'CreatepageBlock'>
                    <div className='Createpage'>
                        <label> 레시피 등록 </label>
                        <br/>
                        <div className = 'create_first'>
                            <p>레시피 제목</p>
                            <input id="recipe-title-input" type='text' placeholder='Title' name='title' 
                            onChange={(event) => this.setState({name: event.target.value})}/>
                            <br/>
                            <p>재료 추가</p>
                            <select name="Ingredients" id="ingredients" 
                    value={this.state.value} onChange={(event) => this.setState({ingredient: event.target.value})}>
                                <option id='ingredient' value="ramyun">라면</option>
                                <option id='ingredient' value="sausage">소시지</option>
                                <option id='ingredient' value="kimbap">삼각김밥</option>
                                <option id='ingredient' value="juice">쥬시클</option>
                            </select>
                            <br/>
                            <p>예상 조리 시간</p>
                            <input id="recipe-cooking-time-input" type='number' 
                    value={this.state.value} onChange={(event) => this.setState({time: event.target.value})} placeholder='minutes' name='cooking-time' />
                            {"  분"}
                        </div>
                        <br/>
                        <div className = 'create_second'>
                            <p>조리 방법</p>
                            {this.state.CreateStepList}
                            <br/>
                            <button id='addStep' onClick={()=> this.onClickAddStep()}>Click to add a step</button>
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
                            <button id='submit' onClick={()=>this.onClickSubmit()}>Submit</button>
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
       
    };
}
  
const mapDispatchToProps = dispatch => {
    return {
        onCreate: (recipe) => dispatch(actionCreators.createRecipe(recipe)),

        }
    }

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Createpage));

