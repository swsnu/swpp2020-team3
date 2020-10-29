import React, {Component} from 'react';
import Comment from './Comment';

import './Comments.css';

class Comments extends Component {

    render() {
        const commentData = [{'content': 'comment1'}, {'content': 'comment2'}]
        const commentlist = commentData.map( (item) => <Comment content={item.content}/>)
        return (
            <div className='comments'>
                {commentlist}
                <input></input>
                <button>confirm</button>
            </div>
        )
    }
}

export default Comments;