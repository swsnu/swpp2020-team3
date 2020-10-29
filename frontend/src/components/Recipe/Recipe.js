import React from 'react';

const Recipe = (props) => {
    return (
        <div className="Recipe" onClick={props.clicked}>
            <div className='row'>
                {props.author}
            </div>
            <div className='row'>
                {props.abstraction}
            </div>
            <div className='row'>
                {props.title}
            </div>
            <div className='row'>
                {props.rating}
            </div>
            <div className='row'>
                <p>{props.time}</p>
                <p>{props.cost}</p>
                <button>{props.likes}</button>
            </div>
        </div>
    );
};

export default Recipe;