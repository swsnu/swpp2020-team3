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
                <div id='Comment'>
                    <div id='comauthor'>{this.props.author}</div>
                    <div id='comcontent'>{this.props.content}</div>
                    <div id='commentButtons'>
                        {(this.props.login_id==this.props.author)?<div><button id='edit-comment-button' onClick={this.onEdit}>수정</button>
                        <button id='delete-comment-button' onClick={() => this.props.onDeleteComment()}>삭제</button></div>:null}
                        <button id='toggle-reply-button' onClick={()  => this.setState({toggleReply: !this.state.toggleReply})}>답글</button>
                    </div>
                    {this.state.toggleReply?replies:null}
                </div>
                <hr id='bottomline' />
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
