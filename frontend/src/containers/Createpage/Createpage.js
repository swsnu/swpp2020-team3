import React, {Component} from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
// Local imports
import CreateStep from '../../components/CreateStep'
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
            <div className='Createpage'>
                <h1>Dish name</h1>
                <input id="recipe-title-input" type='text' placeholder='Title'
                    name='title' onChange={(event) => this.setState({name: event.target.value})} />
                
                <h1>Add ingredients</h1>
                <select name="Ingredients" id="indredients" 
                    value={this.state.value} onChange={(event) => this.setState({ingredient: event.target.value})}>
                    <option id='ingredient' value="ramyun">라면</option>
                    <option id='ingredient' value="sausage">소시지</option>
                    <option id='ingredient' value="kimbap">삼각김밥</option>
                    <option id='ingredient' value="juice">쥬시클</option>
                </select>
                
                <h1>Approximate cooking time</h1>
                <input id="recipe-cooking-time-input" type='number' 
                    value={this.state.value} onChange={(event) => this.setState({time: event.target.value})} placeholder='minutes' name='cooking-time' />
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
                <p>{this.state.price} 원</p>
                
                <button id='submit' onClick={()=>this.onClickSubmit()}>Submit</button>
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

