import React, {Component} from 'react';

import DishResult from '../../components/detail/DishResult';
import DishStep from '../../components/detail/DishStep';
import Comments from '../comments/Comments';
import './Detailpage.css';

class Detailpage extends Component {
    render() {
        const methodData = [{img: require('../../Image/LOGO.png')   , explanation:'first'}, {img: require('../../Image/LOGO.png'), explanation:'second'}]
        const methods = methodData.map((item) => <DishStep img={item.img} explanation={item.explanation}/>)
        return (
            <div className="Detailpage">
                <DishResult img={require('../../Image/LOGO.png')} abstraction='sample_recipe' ingredients='no'/>
                <div className='dish_method'>
                    {methods}
                    <button>Edit</button>
                    <button>Delete</button>
                </div>
                <Comments/>
            </div>
        )
    }
}

export default Detailpage;