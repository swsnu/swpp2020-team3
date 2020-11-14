import React, {Component} from 'react';
import './DisplayRecipe.css'

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

export default DisplayRecipe;