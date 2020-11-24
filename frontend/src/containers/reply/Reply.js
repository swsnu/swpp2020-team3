import React, {Component} from 'react';
import PropTypes from "prop-types";

class Reply extends Component {
    state = {
        author_name:''
    }
    onEdit = () => {
        let newContent = prompt("new comment", this.props.content); // edit comment prompt
        // if valid editing, change comment
        if(newContent){
            this.props.onEditReply(newContent);
        }
    }
    
    render() {
        return(
            <div className = 'reply'>
                <p>{this.props.content} - {this.props.author}</p>
                {(this.props.login_id==this.props.author)?
                <div>
                    <button id='edit-reply-button' onClick={this.onEdit}>edit</button>
                    <button id='delete-reply-button' onClick={() => this.props.onDeleteReply()}>delete</button>
                </div>:
                null}
            </div>
        ) 
    }
}

Reply.propTypes = {
    onEditReply: PropTypes.func,
    onDeleteReply: PropTypes.func,
    content: PropTypes.string,
    author: PropTypes.string
};

export default Reply;
