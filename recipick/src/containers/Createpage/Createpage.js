import React, {Component} from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
// Local imports
import CreateStep from '../../components/CreateStep'

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
            <div className='Createpage'>
                <h1>Dish name</h1>
                <input id="recipe-title-input" type='text' placeholder='Title' name='title' />
                
                <h1>Add ingredients</h1>
                <select name="Ingredients" id="indredients">
                    <option id='ingredient' value="ramyun">라면</option>
                    <option id='ingredient' value="sausage">소시지</option>
                    <option id='ingredient' value="kimbap">삼각김밥</option>
                    <option id='ingredient' value="juice">쥬시클</option>
                </select>
                
                <h1>Approximate cooking time</h1>
                <input id="recipe-cooking-time-input" type='number' placeholder='minutes' name='cooking-time' />
                <p>분</p>
                
                <h1>How to</h1>
                {this.state.CreateStepList}
                <button id='addStep' onClick={()=> this.onClickAddStep()}>Click to add a step</button>
                
                <h1>Select a category</h1>
                <div className='buttons'>
                    <button id='type' onClick={(event)=>this.onClickChangeColor(event, 'Italian')}>Italian</button>
                    <button id='type' onClick={(event)=>this.onClickChangeColor(event, 'Korean')}>Korean</button>
                    <button id='type' onClick={(event)=>this.onClickChangeColor(event, 'Japanese')}>Japanese</button>
                    <button id='type' onClick={(event)=>this.onClickChangeColor(event, 'Chinese')}>Chinese</button>
                    <button id='type' onClick={(event)=>this.onClickChangeColor(event, 'Mexican')}>Mexican</button>
                    <button id='type' onClick={(event)=>this.onClickChangeColor(event, 'Moroccan')}>Moroccan</button>
                </div>
                
                <h1>Total estimated price</h1>
                <h3>Price Calculated</h3>
                <p>원</p>
                
                <button id='submit' onClick={()=>this.onClickSubmit()}>Submit</button>
            </div>
        )        
    }
}

export default withRouter(Createpage);

