import React, {Component} from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from "prop-types";

import * as actionCreators from '../../store/actions/index'
import './Mealplanner.css'

class Mealplanner extends Component{

    state={
        min: '',
        max: '',
        numOfDays: '',
        recipeArray: [[null, null, null], [null, null, null], [null, null, null]]
    }

    componentDidMount() {
        // Will remove this and replace with reducer that gets ml recommendation
        let toEraseQuery;
        toEraseQuery = {
            category1: true,
            category2: true,
            category3: true,
            category4: true,
            category5: true,
            category6: true,
            minPrice: 0,
            maxPrice: 1000,
            minDuration: 0,
            maxDuration: 1000,
            pageStart: 0,
        }
        this.props.getRecipes(toEraseQuery).then((res) => console.log(res))
    }

    clickSave(){
        console.log('save')
        this.props.saveMealPlanner()
    }
    addDayAbove(index){
        if(this.state.recipeArray.length >= 7){
            console.log('max number is 7')
        }
        else{
            let insertSubList = [null, null, null]
            let list = this.state.recipeArray;
            list.splice(index, 0, insertSubList)
            this.setState({recipeArray: list})
        }
    }
    deleteDay(index){
        if(this.state.recipeArray.length == 1){
            console.log("can't make empty list")
        }
        else{
            let list = this.state.recipeArray;
            list.splice(index, 1)
            this.setState({recipeArray: list})
        }
    }
    generateSingleML(){
        console.log('generate single day ML')
    }


    render(){
        let daysBlock = this.state.recipeArray.map((dayBlock, index) => (
            <div className='day'>
                <button onClick={() => this.addDayAbove(index)}>Add a day</button>
                <button onClick={() => this.deleteDay(index)}>Delete day</button>
                {dayBlock.map((meal) => (
                    <div>
                    <div className='singleBlock'></div> {/* or it could be thumbnail of recipe */}
                    <br/>
                    </div>
                )) }
                <button onClick={() => this.generateSingleML()}>Regenerate</button>
            </div>
        ))

        let scrappedRecipes = 'daslkj';
        
        return(
            <div className = 'Mealplanner'>
                <button onClick={this.clickSave}>Save</button>
                <div className='Searchbar'>
                    <label>하한</label>
                    <input type='number' value={this.state.min} onChange={(event) => this.setState({min: event.target.value})}/>
                    <br/>
                    <label>상한</label>
                    <input type='number' value={this.state.max} onChange={(event) => this.setState({max: event.target.value})}/>
                    <br/>
                    <label>Number of days</label>
                    <input type='number' min='0' max='7' placeholder='최대 7일' value={this.state.numOfDays} id='numOfDays'
                        onChange={(event) => this.setState({numOfDays: event.target.value})} />
                    <button>ML Generate</button>
                </div>
                <div className='recipes'>
                    {daysBlock}
                </div>
                <div className='cookbook'> {/* couldn't put it higher */}
                    {scrappedRecipes}
                </div>
            </div>
        )        
    }
}

const mapStateToProps = state => {
    return {
        storedRecipes: state.rcp.recipes,
    }
}
  
const mapDispatchToProps = dispatch => {
    return {
        getRecipes: (searchSettings) =>
            dispatch(actionCreators.getRecipes(searchSettings)),
    }
}

Mealplanner.propTypes = {
    // onGetRandom: PropTypes.func,
    // storedRecipes: PropTypes.array,
    // history: PropTypes.object
};

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Mealplanner));
