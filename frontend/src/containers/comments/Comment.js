import React, {Component} from 'react';
import './Comment.css'

class Comment extends Component {
    render() {
        return (
            <div className='comment'>
                <div>
                    {this.props.content}
                </div>
                <button>edit</button>
                <button>delete</button>
            </div>
        )
    }
}

export default Comment;