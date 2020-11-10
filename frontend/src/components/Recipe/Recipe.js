import React from 'react';
import './Recipe.css'
const Recipe = (props) => {
    return (
        <div className='Recipe'>
            <img src = {props.thumbnail} width={200} onClick={props.clickedRecipe}></img>
            <div className='recipe_title'>
                {props.title}
            </div>
            <div className='recipe_author'>
                {props.author}
            </div>   
            <div className='recipe_rating'>
                {props.rating}
            </div>
            <div className='recipe_cost'>
                {props.cost}
            </div>
            <button className='recipe_likes' onClick={props.clickedLikes}>{props.likes}</button>
        </div>
    );
};

export default Recipe;