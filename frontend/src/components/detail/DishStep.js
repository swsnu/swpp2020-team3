import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './DishStep.css';

class DishStep extends Component {
    render() {
        return (
            <div className='dish_step'>
                <br/>
                <img src={this.props.img} width='600'/>
                <div className='dish_explanation'>
                    {this.props.explanation}
                </div>
                <br/>
            </div>
        )
    }
}

DishStep.PropTypes = {
    img: PropTypes.string,
    explanation: PropTypes.string,
}
export default DishStep;