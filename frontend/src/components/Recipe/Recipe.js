import React from 'react';

const Recipe = (props) => {
    return (
        <div className='Recipe'>
            <div className='recipe_author'>
                {props.author}
            </div>
            <div className='recipe_abstraction'>
                {props.abstraction}
            </div>
            <div className='recipe_title'>
                {props.title}
            </div>
            <div className='recipe_rating'>
                {props.rating}
            </div>
            <div className='row'>
                <p className='recipe_time'>{props.time}</p>
                <p className='recipe_cost'>{props.cost}</p>
                <button className='recipe_likes' onClick={props.clickedLikes}>{props.likes}</button>
                <button className='recipe-detail-button' onClick={props.clickedRecipe}>detail</button>
            </div>
        </div>
    );
};

export default Recipe;