import React, {Component} from 'react';
import './DisplayRecipe.css'

const DisplayRecipe = props => {
    return (
        <div className = 'DisplayRecipe'>
            <div id = 'DRImage'>{props.img}</div>
            <div id = 'DRTitle'>{props.title}</div>
        </div>
    )
}

export default DisplayRecipe;