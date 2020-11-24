import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import * as actionCreators from '../../store/actions/index';
import Reply from './Reply';

class Replies extends Component {

    state = {
        content: '',
        replies: null,
    }

    constructor(props) {
        super(props);
    }

    onAddReply = () => {
        this.props.isLogin().then(res => {
            if(!res.login_id){
                let input = window.confirm("로그인이 필요합니다. 로그인 하시겠습니까?");
                if(input){
                    this.props.history.push('/login')
                }
            }
            else{
                this.props.addReply({date:'2020-11-05', edited:false, content: this.state.content, commentId: this.props.commentId});
                this.setState({content: ''});
            }
        })
        
    }
    render() {
        const replylist = this.props.replies.map( (item) => <Reply login_id={this.props.login_id} key={item.id} content={item.content} author={item.author_id} 
            onEditReply={(content) => this.props.onEditReply({id: item.id, content, edited: true})} onDeleteReply={() => this.props.onDeleteReply(item.id)}/>)
        return (
            <div className='replies'>
                {replylist}
                <input className='reply-content-input' value={this.state.content} onChange={(e) => this.setState({content: e.target.value})}/>
                <button className='create-reply-button' disabled={this.state.content==''} onClick={() => this.onAddReply()}>confirm</button>
            </div>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        onEditReply: (reply) => dispatch(actionCreators.editReply(reply)),
        onDeleteReply: (reply) => dispatch(actionCreators.deleteReply(reply)),
        addReply: (reply) => dispatch(actionCreators.addReply(reply)),
        isLogin: () => dispatch(actionCreators.isLogin())
    }
}


Replies.propTypes = {
    onEditReply: PropTypes.func,
    onDeleteReply: PropTypes.func,
    addReply: PropTypes.func,
    replies: PropTypes.array,
    commentId: PropTypes.string
};

export default connect(null, mapDispatchToProps)(Replies);
