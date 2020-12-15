import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actionCreators from '../../store/actions/index';
import Comment from './Comment';

import './Comments.css';

class Comments extends Component {

    state={
        content:'',
        pageStart : 0,
        pageNumber: 1,
    }

    componentDidMount() {
        this.props.getComments(this.props.recipeId)
            .then(res => {
                //console.log(res);
                let list = res.comments.map(item => item.id)
                this.props.getReplySet(list)
            })
    }

    clickPagePreviousHandler = () => {
        let newState={...this.state, pageStart: this.state.pageStart-5, pageNumber: this.state.pageStart-4};
        this.setState(newState)
    }

    clickPageNumberHandler = (id) => {
        let newState={...this.state, pageNumber: this.state.pageStart+id};
        this.setState(newState)
    }

    clickPageNextHandler = () => {
        let newState={...this.state, pageStart: this.state.pageStart+5, pageNumber: this.state.pageStart+6};
        this.setState(newState);
    }

    onAddComment = () => {
        console.log(1);
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

    handleKeyPress = (e) => {
        if(e.key == 'Enter' && this.state.content!=''){
            this.onAddComment();
        }
    }

    render() {
        const reversedComments = this.props.comments.slice().reverse();
        const slicedComments = reversedComments.slice(5*(this.state.pageNumber-1), 5*(this.state.pageNumber));
        const commentlist = slicedComments.map( (item) => 
            <Comment login_id={this.props.login_id} key={item.id} history={this.props.history} replies={this.props.replies.filter((reply) => reply.comment_id==item.id)} content={item.content} author={item.author_id} name={item.author__username} id={item.id}
            onEditComment={(content) => this.props.onEditComment({id: item.id, content, edited: true})} onDeleteComment={() => this.props.onDeleteComment(item.id)}/>)
        return (
            <div id='scrollcomment' className='comments'>
                <div id='newComments'>
                    <div id='newcommentlabel'>{'새 댓글'}</div>
                    <input id='new-comment' value={this.state.content} onKeyPress={(e) => this.handleKeyPress(e)} onChange={(e) => this.setState({content: e.target.value})}/>
                    <button id='add-comment' disabled={this.state.content==''} onClick={() => this.onAddComment()}>작성</button>
                </div> 
                {commentlist}
                <div className = "pages">
                    <div className = "page">
                        {reversedComments.length >= 1 && <p>Page</p>}
                    </div>
                    <div className = "row">
                        {this.state.pageStart != 0 && reversedComments.length >= 1 && <button className="list-page-previous-button"
                                onClick={() => this.clickPagePreviousHandler()}>left</button>}
                        {reversedComments.length - 5*this.state.pageStart >= 1 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==1 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(1)}>{this.state.pageStart+1}</button>}
                        {reversedComments.length - 5*this.state.pageStart >= 6 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==2 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(2)}>{this.state.pageStart+2}</button>}
                        {reversedComments.length - 5*this.state.pageStart >= 11 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==3 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(3)}>{this.state.pageStart+3}</button>}
                        {reversedComments.length - 5*this.state.pageStart>= 16 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==4 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(4)}>{this.state.pageStart+4}</button>}
                        {reversedComments.length - 5*this.state.pageStart>= 21 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==0 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(5)}>{this.state.pageStart+5}</button>}
                        {reversedComments.length - 5*this.state.pageStart>= 26 && <button className="list-page-next-button"
                                disabled={false} onClick={() => this.clickPageNextHandler()}>right</button>}
                    </div>
                </div>
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