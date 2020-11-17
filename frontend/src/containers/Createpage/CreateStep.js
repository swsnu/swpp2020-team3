import React, {Component} from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
// Local imports
import './Createpage.css'
import './CreateStep.css'
import * as actionCreators from '../../store/actions/index'
import PropTypes from "prop-types";

// TODO: must retreive ingredients
// TODO: must implement preview of image
// TODO(?): abstract the add image part, but the problem is later, I will have to add a delete part...
let value;
class CreateStep extends Component{
    constructor(props){
        super(props)
        const value = {props}
        this.state = {value: this.props.value_text}
        console.log(this.state)
    }
    componentDidMount(){
        this.setState({value: this.props.value_text})
    }
    
    inputHandler(event){
        this.setState({value: event.target.value})
        this.props.event_text({description: event.target.value, index: this.props.index})
    }
    imageHandler(event){
        this.props.event_image({file: event.target.files[0], index: this.props.index})
    }

    render(){
        
        return(
            <div className="step">
                <input type="file" accept='.jpg, .png, .jpeg' onChange={(event) => this.imageHandler(event)}/>
                <br/>
                <textarea type="text" onChange={(event) => this.inputHandler(event)} value={value} />
            </div>     
        )
    }
}
  
const mapDispatchToProps = dispatch => {
    return {
        onCreate: (recipe) => dispatch(actionCreators.createRecipe(recipe)),

        }
    }

CreateStep.propTypes = {
    value_text: PropTypes.string,
    event_text: PropTypes.func,
    index: PropTypes.number,
    event_image: PropTypes.func,
};

export default connect(null,mapDispatchToProps)(withRouter(CreateStep));

