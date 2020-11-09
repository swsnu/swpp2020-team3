import React, {Component} from 'react';
//import './DishResult.css'

class DishResult extends Component {
    render() {
        console.log(this.props.ingredients)
        const showigd = this.props.ingredients
        return (
            <div className='dish_result'>
                <div>
                    {this.props.title}
                </div>
                {this.props.img}
                <div>
                    {this.props.abstraction}
                </div>
                <div>
                    {showigd}
                </div>
            </div>
        )
    }
}

export default DishResult;