import React, {Component} from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
// Local imports
import CreateStep from '../../components/CreateStep'
import './Createpage.css'
class Createpage extends Component{
    state = {
        CreateStepList: [],
        typeList: [],
        redirect: false
    }
    onClickAddStep(){
        console.log("added 1")
        var tempList = this.state.CreateStepList.concat(<CreateStep/>)
        this.setState({CreateStepList: tempList})       
    }

    onClickChangeColor(event, param){
        if (!this.state.typeList.includes(param)){
            console.log("add element")
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
                            <input id="recipe-title-input" type='text' placeholder='Title' name='title' />
                            <br/>
                            <p>재료 추가</p>
                            <select name="Ingredients" id="ingredients">
                                <option id='ingredient' value="ramyun">라면</option>
                                <option id='ingredient' value="sausage">소시지</option>
                                <option id='ingredient' value="kimbap">삼각김밥</option>
                                <option id='ingredient' value="juice">쥬시클</option>
                            </select>
                            <br/>
                            <p>예상 조리 시간</p>
                            <input id="recipe-cooking-time-input" type='number' placeholder='minutes' name='cooking-time' />
                            {"  분"}
                        </div>
                        <br/>
                        <div className = 'create_second'>
                            <p>조리 방법</p>
                            {this.state.CreateStepList}
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
                            {"원"}
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

export default withRouter(Createpage);

