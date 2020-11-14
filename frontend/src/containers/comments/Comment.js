import React, {Component} from 'react';

import Replies from '../reply/Replies';

import './Comment.css'

class Comment extends Component {
    state={
        toggleReply: false,
    }
    onEdit = () => {
        let newContent = prompt("new comment", this.props.content); // edit comment prompt
        // if valid editing, change comment
        if(newContent){
            this.props.onEditComment(newContent)
        }
    }
    
    render() {
        const replies = <Replies replies={this.props.replies} commentId={this.props.id}/>
        return(
            <div>
                <p>{this.props.content} - {this.props.author}</p>
                {<button id='edit-comment-button' onClick={this.onEdit}>edit</button>}
                {<button id='delete-comment-button' onClick={() => this.props.onDeleteComment()}>delete</button>}
                <button id='toggle-reply-button' onClick={()  => this.setState({toggleReply: !this.state.toggleReply})}>replies</button>
                {this.state.toggleReply?replies:null}
            </div>
        ) 
    }
}

export default Comment;
