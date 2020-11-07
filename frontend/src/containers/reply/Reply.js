import React, {Component} from 'react';
import { connect } from 'react-redux';

class Reply extends Component {
    state = {
        author_name:''
    }
    onEdit = () => {
        let newContent = prompt("new comment", this.props.content); // edit comment prompt
        // if valid editing, change comment
        if(newContent){
            this.props.onEditReply(newContent)
        }
    }
    
    render() {
        return(
            <div>
                <p>{this.props.content} - {this.props.author}</p>
                {<button id='edit-reply-button' onClick={this.onEdit}>edit</button>}
                {<button id='delete-reply-button' onClick={() => this.props.onDeleteReply()}>delete</button>}
            </div>
        ) 
    }
}

export default Comment;
