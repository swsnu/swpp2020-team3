import React, {Component} from 'react';
import PropTypes from "prop-types";
import './Reply.css';
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
           <div>
               <hr/>
                <div className = 'reply'>
                    <div id='repauthor'>{this.props.name}</div>
                    <div id='repcontent'>{this.props.content}</div>
                    {
                        (this.props.login_id==this.props.author)?
                        <div>
                            <button id='edit-reply-button' onClick={this.onEdit}>수정</button>
                            <button id='delete-reply-button' onClick={() => this.props.onDeleteReply()}>삭제</button>
                        </div>: 
                        null
                    }
                </div>
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
