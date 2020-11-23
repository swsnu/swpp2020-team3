
import React, {Component} from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from "prop-types";
// import { DragDropContext } from 'react-dnd';
// import HTML5Backend from 'react-dnd-html5-backend';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


import * as actionCreators from '../../store/actions/index'
import './Mealplanner.css'
const initialData = [
    {id: 1, item: 'a'},
    {id: 2, item: 'b'},
    {id: 3, item: 'd'},
    {id: 4, item: 'e'},
    {id: 5, item: 'f'},
];
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };
class Mealplanner extends Component{
    constructor(props){
        super(props)
        this.onDragEnd = this.onDragEnd.bind(this);
        this.state = {initialData: initialData};
        console.log(initialData)
    }
    
    onDragEnd(result){
        if(!result.destination){
            return;
        }
        console.log(result)
        const items = reorder(
            this.state.initialData,
            result.source.index,
            result.destination.index
          );
      
        this.setState({
        initialData: items
        });
    }
    render(){
        return(
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppableId">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {this.state.initialData && this.state.initialData.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.item} index={index}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        <p key={item.id}>{item.item}</p>
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
