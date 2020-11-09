import React, {Component} from 'react';
import './DishResult.css'
//import './DishResult.css'

class DishResult extends Component {
    render() {
        console.log(this.props.ingredients)
        const showigd = this.props.ingredients
        return (
            <div className='dish_result'>
                <div id = 'detailbox1'>
                    <div id = 'detailbox1area1'>
                        <div className = "area1text">
                            <div id ='detailtitle'>{this.props.title}</div>
                            <br/>
                            <div id = 'detailinfo'>
                                <p id='detaillabel'>{'가격'}</p>
                                {this.props.price}
                                <br/>
                                <p id='detaillabel'>{'추천수'}</p>
                                {this.props.likes }
                                <br/>
                                <p id='detaillabel'>{'평점'}</p>
                                {this.props.rating}
                                <br/>
                                <p id='detaillabel'>{'카테고리'}</p>
                                {this.props.category}
                                <br/>
                                <p id='detaillabel'>{'태그'}</p>
                                {this.props.tag}
                            </div>
                        </div>
                        <div id = 'detailthumbnail'>{this.props.img}</div>
                    </div>
                    <div id = 'detailtitle2'>{'레시피 간단 설명'}</div>
                    <div id = 'detailsummary'>
                        {this.props.abstraction}
                    </div>
                </div>
                <div id = 'detailbox2'>
                    <div id = 'detailtitle3'>{'레시피 재료'}</div>
                    {showigd}
                </div>
            </div>
        )
    }
}

export default DishResult;