import React, {Component} from 'react';

import Replies from '../reply/Replies';
import PropTypes from 'prop-types';

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
        const replies = <Replies login_id={this.props.login_id} history={this.props.history} replies={this.props.replies} commentId={this.props.id}/>
        return(
            <div>
                <p>{this.props.content} - {this.props.author}</p>
                <button id='toggle-reply-button' onClick={()  => this.setState({toggleReply: !this.state.toggleReply})}>replies</button>
                {(this.props.login_id==this.props.author)?<div><button id='edit-comment-button' onClick={this.onEdit}>edit</button>
                <button id='delete-comment-button' onClick={() => this.props.onDeleteComment()}>delete</button></div>:null}
                
                {this.state.toggleReply?replies:null}
            </div>
        ) 
    }
}

Comment.propTypes = {
    onEditComment: PropTypes.func,
    onDeleteComment: PropTypes.func,
    content: PropTypes.string,
    replies: PropTypes.array,
    id: PropTypes.number,
    author: PropTypes.number,
};

export default Comment;
