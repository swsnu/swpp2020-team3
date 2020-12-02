import React, {Component} from 'react';
import './DisplayRecipe.css'
import PropTypes from "prop-types";

class DisplayRecipe extends Component {
    onClickRandomImage(id){
        this.props.history.push('/detail-page/'+id)
    }

    render() {
        return (
            <div className = 'DisplayRecipe'>
                <div id = 'DRImage' onClick = {() => this.onClickRandomImage(this.props.id)}>{this.props.img}</div>
                <div id = 'DRTitle'>{this.props.title}</div>
            </div>
        )
    }
}

DisplayRecipe.propTypes = {
    history: PropTypes.object,
    id: PropTypes.number,
    img: PropTypes.string,
    title: PropTypes.string,
};

export default DisplayRecipe;