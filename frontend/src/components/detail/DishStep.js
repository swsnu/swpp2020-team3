import React, {Component} from 'react';
import './DishStep.css';

class DishStep extends Component {
    render() {
        return (
            <div className='dish_step'>
                <br/>
                <img src={this.props.img}/>
                <div className='dish_explanation'>
                    {this.props.explanation}
                </div>
                <br/>
            </div>
        )
    }
}

export default DishStep;