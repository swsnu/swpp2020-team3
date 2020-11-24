import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actionCreators from '../../store/actions/index';
import Comment from './Comment';

import './Comments.css';

class Comments extends Component {

    state={
        content:''
    }

    componentDidMount() {
        this.props.getComments(this.props.recipeId)
            .then(res => {
                console.log(res);
                let list = res.comments.map(item => item.id)
                this.props.getReplySet(list)
            })
    }

    onAddComment = () => {
        this.props.isLogin().then(res => {
            if(!res.login_id){
                let input = window.confirm("로그인이 필요합니다. 로그인 하시겠습니까?");
                if(input){
                    this.props.history.push('/login')
                }
            }
            else{
                this.props.addComment({date:'2020-11-05', edited:false, content: this.state.content, recipeId: this.props.recipeId});
                this.setState({content: ''});
            }
        })
    }

    render() {
        const commentlist = this.props.comments.map( (item) => 
            <Comment login_id={this.props.login_id} key={item.id} history={this.props.history} replies={this.props.replies.filter((reply) => reply.comment_id==item.id)} content={item.content} author={item.author_id} id={item.id}
            onEditComment={(content) => this.props.onEditComment({id: item.id, content, edited: true})} onDeleteComment={() => this.props.onDeleteComment(item.id)}/>)
        return (
            <div id='scrollcomment' className='comments'>
                {commentlist}
                <input id='new-comment' value={this.state.content} onChange={(e) => this.setState({content: e.target.value})}/>
                <button id='add-comment' disabled={this.state.content==''} onClick={() => this.onAddComment()}>confirm</button>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        comments: state.comment.comments,
        replies: state.reply.replies
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getComments: (recipeId) => dispatch(actionCreators.getComments(recipeId)),
        onEditComment: (comment) => dispatch(actionCreators.editComment(comment)),
        onDeleteComment: (commentId) => dispatch(actionCreators.deleteComment(commentId)),
        addComment: (comment) => dispatch(actionCreators.addComment(comment)),
        getReplySet: (comment_id_list) => dispatch(actionCreators.getReplySet(comment_id_list)),
        isLogin: () => dispatch(actionCreators.isLogin())
    }
}

Comments.propTypes = {
    getComments: PropTypes.func,
    getReplySet: PropTypes.func,
    onEditComment: PropTypes.func,
    onDeleteComment: PropTypes.func,
    addComment: PropTypes.func,
    comments: PropTypes.array,
    replies: PropTypes.array,
    recipeId: PropTypes.number
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments);