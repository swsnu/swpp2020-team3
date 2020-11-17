import React, {Component} from 'react';
import PropTypes from 'prop-types';


class EditDishStep extends Component {
    state = {
        explanation: ''
    }
    componentDidMount(){
        this.setState({explanation: this.props.explanation})
        this.setState({img_preview: this.props.img})
        // this.setState({photo: this.props.explanation})
    }
    updateState(key, value){
        this.props.updateState(key, value)
    }
    imageHandler(event){
        let file = event.target.files[0]
        let reader = new FileReader();
        reader.onloadend = () => {
            this.updateState('photo_list', file)
            this.setState({img_preview: reader.result})
            this.setState({img_file: file})
        }
        reader.readAsDataURL(file)
    }
    changeTitle(event){
        this.setState({explanation: event.target.value})
        this.updateState('description_list', event.target.value)
    }
    deleteRecipe(){
        this.updateState('description_list')
    }

    render() {
        // console.log(this.props.img)
        return (
            <div className='edit-dish_step'>
                <br/>
                {/* <img src={this.state.img_preview} width='600'/> */}
                <input type="file" accept='.jpg, .png, .jpeg' onChange={(event) => this.imageHandler(event)}/>
                <div className='dish_explanation'>
                    <input id='detailtitle' value={this.state.explanation} onChange={(event) => {this.changeTitle(event)}}/>
                    <button id = "delete-button" onClick={() => this.deleteRecipe()}>Delete</button>
                </div>
                <br/>
            </div>
        )
    }
}

EditDishStep.propTypes = {
    img: PropTypes.string,
    explanation: PropTypes.string,
}
export default EditDishStep;