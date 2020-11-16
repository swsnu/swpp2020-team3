import React, {Component} from 'react';
import PropTypes from 'prop-types';


class EditDishResult extends Component {
    state = {
        title: this.props.title,
        price: this.props.price,
        likes: this.props.likes,
        rating: this.props.rating,
        category: this.props.category,
        abstraction: this.props.abstraction,
    }
    render() {
        const showigd = this.props.ingredients
        const tag = this.props.tag && this.props.tag.map((tag) => <span key={tag} id='tag'>{tag} </span>)
        return (
            <div className='dish_result'>
                <div id = 'detailbox1'>
                    <div id = 'detailbox1area1'>
                        <div className = "area1text">
                            <input id='detailtitle' value={this.state.title} onChange={(event) => {this.setState({title: event.target.value})}}/>
                            <br/>
                            <div id = 'detailinfo'>
                                <p id='detaillabel'>{'가격'}</p>
                                {this.state.price}
                                <br/>
                                <p id='detaillabel'>{'추천수'}</p>
                                {this.props.likes}
                                <br/>
                                <p id='detaillabel'>{'평점'}</p>
                                {this.props.rating}
                                <br/>
                                <p id='detaillabel'>{'카테고리'}</p>
                                {"make into select"}
                                <input id='detailcategory' value={this.state.category} onChange={(event) => {this.setState({category: event.target.value})}}/>
                                <br/>
                                <p id='detaillabel'>{'태그'}</p>
                                {tag}
                            </div>
                        </div>
                        <p>{"must be able to change thumbnail"}</p>
                        <div id = 'detailthumbnail'>{this.props.img}</div>
                    </div>
                    <div id = 'detailtitle2'>{'레시피 간단 설명'}</div>
                    <div id = 'detailsummary'>
                        <textarea id='detailabstraction' value={this.state.abstraction} onChange={(event) => {this.setState({abstraction: event.target.value})}}/>
                    </div>
                </div>
                <div id = 'detailbox2'>
                    <div id = 'detailtitle3'>{'레시피 재료'}</div>
                    {"must be able to add, delete an ingredient"}
                    {showigd}
                </div>
            </div>
        )
    }
}

EditDishResult.propTypes = {
    ingredients: PropTypes.array,
    tag: PropTypes.string,
    price: PropTypes.number,
    likes: PropTypes.number,
    title: PropTypes.string,
    rating: PropTypes.number,
    category: PropTypes.string,
    img: PropTypes.string,
    abstraction: PropTypes.string,
}
export default EditDishResult;