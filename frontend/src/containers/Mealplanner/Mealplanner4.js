import React, {Component} from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from "prop-types";
// import { DragDropContext } from 'react-dnd';
// import HTML5Backend from 'react-dnd-html5-backend';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


import * as actionCreators from '../../store/actions/index'
import './Mealplanner.css'
import { DragSource } from 'react-dnd';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };
const unflatten = (arr, n) => {
    arr.reduce((acc, entry, i) => (i % n ? acc[acc.length-1].push(entry) : acc.push([entry]),acc), [])
}
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
  function splitArrayIntoChunksOfLen(arr, len) {
    var chunks = [], i = 0, n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, i += len));
    }
    return chunks;
  }
const reorder2 = (list, startIndex, endIndex) => {
    console.log(list)
    let result = Array.from(list).flat()
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    // let temp = result[startIndex-1]
    // result[startIndex-1] = result[endIndex-1]
    // result[endIndex-1] = temp
    result = chunk(result, 3)
    console.log(result)
    return result;
}
class Mealplanner extends Component{
    constructor(props){
        super(props)
        this.onDragEnd = this.onDragEnd.bind(this);
    }
    state={
        min: '',
        max: '',
        numOfDays: '',
        recipeArray: [[{index: 1, value: 0}, {index: 2, value: 0}, {index: 3, value: 0}], 
        [{index: 4, value: 0}, {index: 5, value: 0}, {index: 6, value: 0}], 
        [{index: 7, value: 0}, {index: 8, value: 0}, {index: 9, value: 0}]],
        scrappedRecipes: [{id: 1, thumbnail: 'hana'}, {id: 2, thumbnail: 'duna'}, 
        {id: 3, thumbnail: 'sena'}, {id: 4, thumbnail: 'nena'}]
    }
    componentDidMount() {
        // Will remove this and replace with reducer that gets ml recommendation
        let toEraseQuery;
        toEraseQuery = {
            category1: true, category2: true, category3: true, category4: true, category5: true, category6: true,
            minPrice: 0, maxPrice: 1000,
            minDuration: 0, maxDuration: 1000,
            pageStart: 0,
        }
        this.props.getRecipes(toEraseQuery).then((res) => console.log(res))
        // this.props.getScrappedRecipes().then((res) => this.setState({scrappedRecipes: res.data})) // not implemented yet
    }
    
    onDragEnd(result){
        console.log(result)
        const {source, destination} = result
        if(!destination){
            return;
        }
        if(source.droppableId == destination.droppableId){
            if(source.droppableId == 'droppableId_cookbook'){
                const items = reorder(
                    this.state.scrappedRecipes,
                    source.index,
                    destination.index
                );
                this.setState({scrappedRecipes: items});
            }
            else{
                const items = reorder2(
                    this.state.recipeArray,
                    source.index,
                    destination.index
                );
                console.log(source.index)
                console.log(destination.index)
                this.setState({recipeArray: items});
            }
        }
        else{ // one list to another
            console.log('corner case')
        }
    }

    render(){
        return(
            <DragDropContext onDragEnd={this.onDragEnd}>

                <Droppable droppableId="droppableId_recipes">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {this.state.recipeArray && this.state.recipeArray.map((dayBlock, ind) => (
                            <div className='day' key={ind}>
                                <button onClick={() => this.addDayAbove(ind)}>Add a day</button>
                                <button onClick={() => this.deleteDay(ind)}>Delete day</button>
                                {dayBlock && dayBlock.map((meal, index) => (
                                    <Draggable key={meal.index} draggableId={JSON.stringify(meal)} index={meal.index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <div className='singleBlock' key={meal.index}>
                                                    <p>{meal.value}</p>
                                                </div> 
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                        {provided.placeholder}
                            </div>
                        ))}
                    </div>
                )}
                </Droppable>
                <Droppable droppableId="droppableId_cookbook">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {this.state.scrappedRecipes && this.state.scrappedRecipes.map((recipe, index) => (
                            <Draggable key={recipe.id} draggableId={recipe.thumbnail} index={index}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        <div className='scrappedRecipe'>
                                            <p>{recipe.thumbnail}</p>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            </DragDropContext>
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

export default  connect(mapStateToProps,mapDispatchToProps)(withRouter(Mealplanner));
