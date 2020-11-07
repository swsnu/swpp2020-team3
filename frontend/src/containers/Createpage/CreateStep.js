import React, {Component} from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
// Local imports
import './Createpage.css'
import * as actionCreators from '../../store/actions/index'

// TODO: must retreive ingredients
// TODO: must implement preview of image
// TODO(?): abstract the add image part, but the problem is later, I will have to add a delete part...
class CreateStep extends Component{
    inputHandler(event){
        this.props.event_text({description: event.target.value, index: this.props.index})
    }
    imageHandler(event){
        console.log("change image")
        console.log(this.props.index)
        this.props.event_image({file: event.target.files[0], index: this.props.index})
    }

    render(){
        return(
            <div className="step">
                <label>Add image</label>
                <br/>
                <input type="file" accept='.jpg, .png, .jpeg' 
                    onChange={(event) => this.imageHandler(event)}/>
                <br/>
                <textarea type="text" onChange={(event) => this.inputHandler(event)}/>
            </div>     
        )
    }
}

const mapStateToProps = state => {
    return {
       
    };
}
  
const mapDispatchToProps = dispatch => {
    return {
        onCreate: (recipe) => dispatch(actionCreators.createRecipe(recipe)),

        }
    }

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(CreateStep));

