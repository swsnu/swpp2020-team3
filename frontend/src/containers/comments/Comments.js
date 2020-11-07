import React, {Component} from 'react';
import { connect } from 'react-redux';

import * as actionCreators from '../../store/actions/index';
import Comment from './Comment';

import './Comments.css';

class Comments extends Component {

    state={
        content:''
    }
    componentDidMount() {
        this.props.getComments(this.props.recipeId);
    }
    render() {
        const commentlist = this.props.comments.map( (item) => <Comment content={item.content} author={item.author_id} id={item.id}
            onEditComment={(content) => this.props.onEditComment({id: item.id, content, edited: true})} onDeleteComment={() => this.props.onDeleteComment(item.id)}/>)
        return (
            <div className='comments'>
                {commentlist}
                <input value={this.state.content} onChange={(e) => this.setState({content: e.target.value})}/>
                <button disabled={this.state.content==''} onClick={() => {this.setState({content: ''}); this.props.addComment({date:'2020-11-05', edited:false, content: this.state.content, recipeId: this.props.recipeId});}}>confirm</button>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        comments: state.comment.comments
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getComments: (recipeId) => dispatch(actionCreators.getComments(recipeId)),
        onEditComment: (comment) => dispatch(actionCreators.editComment(comment)),
        onDeleteComment: (commentId) => dispatch(actionCreators.deleteComment(commentId)),
        addComment: (comment) => dispatch(actionCreators.addComment(comment)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Comments);