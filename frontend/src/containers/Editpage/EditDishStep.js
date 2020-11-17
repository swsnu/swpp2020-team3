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
    static getDerivedStateFromProps(props, state) {
        if (props.explanation !== state.explanation) {
            console.log("update")
          return {
            explanation: props.explanation,
          };
        }
        // if(props.img !== state.img_preview){
        //     console.log("image update")
        //     return {
        //         img_preview: props.img
        //     }
        // }
        // Return null to indicate no change to state.
        return null;
      }

    updateState(key, value){
        this.props.updateState(key, value)
    }
    imageHandler(event){
        let file = event.target.files[0]
        let reader = new FileReader();
        reader.onloadend = () => {
            console.log(reader.result)
            let imgstr = reader.result.split(';base64, ')
            this.updateState('photo_list', imgstr[1])
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
        console.log(this.state.img_preview == this.props.img)
        // console.log(this.props.img)
        return (
            <div className='edit-dish_step'>
                <br/>
                <img src={this.state.img_preview} width='600'/>
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