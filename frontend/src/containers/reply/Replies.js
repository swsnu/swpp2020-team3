import React, {Component} from 'react';
import { connect } from 'react-redux';

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

    render() {
        const replylist = this.props.replies.map( (item) => <Reply content={item.content} author={item.author_id} 
            onEditReply={(content) => this.props.onEditReply({id: item.id, content, edited: true})} onDeleteReply={() => this.props.onDeleteReply(item.id)}/>)
        return (
            <div className='replies'>
                {replylist}
                <input value={this.state.content} onChange={(e) => this.setState({content: e.target.value})}/>
                <button disabled={this.state.content==''} onClick={() => {this.setState({content: ''}); this.props.addReply({date:'2020-11-05', edited:false, content: this.state.content, commentId: this.props.commentId});}}>confirm</button>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {

        }
}

const mapDispatchToProps = dispatch => {
    return {
        getReplies: (commentId) => dispatch(actionCreators.getReplies(commentId)),
        onEditReply: (reply) => dispatch(actionCreators.editReply(reply)),
        onDeleteReply: (reply) => dispatch(actionCreators.deleteReply(reply)),
        addReply: (reply) => dispatch(actionCreators.addReply(reply)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Replies);
