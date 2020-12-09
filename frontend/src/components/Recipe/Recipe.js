import React from 'react';
import './Recipe.css';
import StarRatings from 'react-star-ratings';
import PropTypes from "prop-types";
const Recipe = (props) => {
    return (
        <div className='Recipe'>
            <img className = 'recipe_thumbnail' src = {props.thumbnail} width={200} onClick={props.clickedRecipe}></img>
            <div className='recipe_title'>
                {props.title}
            </div>
            <div className='recipe_author'>
                {props.author}
            </div>   
            <div className='recipe_rating'>
                <StarRatings
                    rating={props.rating}
                    starRatedColor="orange"
                    numberOfStars={5}
                    name='rating'
                    starDimension = {15}
                    starSpacing = {2}
                />
                {"("+props.rating+")"}
            </div>
            <div className='recipe_cost'>
                {props.cost+"원"}
            </div >
            <div className='recipe_likes'>
                {"추천수: "+props.likes}
            </div>
        </div>
    );
};

Recipe.propTypes = {
    thumbnail: PropTypes.string,
    clickedRecipe: PropTypes.func,
    title: PropTypes.string,
    author: PropTypes.string,
    rating: PropTypes.number,
    cost: PropTypes.number,
    likes: PropTypes.number,
};

export default Recipe;
