import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import * as actionCreators from '../../store/actions/index';
import Reply from './Reply';
import './Replies.css'
class Replies extends Component {

    state = {
        content: '',
        replies: null,
        pageStart: 0,
        pageNumber: 1,
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

    handleKeyPress = (e) => {
        if(e.key == 'Enter' && this.state.content!=''){
            this.onAddReply();
        }
    }

    render() {
        const reversedReplies = this.props.replies.slice().reverse();
        const slicedReplies = reversedReplies.slice(5*(this.state.pageNumber-1), 5*(this.state.pageNumber));
        const replylist = slicedReplies.map( (item) => <Reply login_id={this.props.login_id} key={item.id} content={item.content} name={item.author__username} author={item.author_id} 
            onEditReply={(content) => this.props.onEditReply({id: item.id, content, edited: true})} onDeleteReply={() => this.props.onDeleteReply(item.id)}/>)
        return (
            <div className='replies'>
                {replylist}
                <hr/>
                <input className='reply-content-input' onKeyPress={(e) => this.handleKeyPress(e)} value={this.state.content} onChange={(e) => this.setState({content: e.target.value})}/>
                <button className='create-reply-button' disabled={this.state.content==''} onClick={() => this.onAddReply()}>작성</button>
                <div className = "pages">
                    <div className = "page">
                        {reversedReplies.length >= 1 && <p>Page</p>}
                    </div>
                    <div className = "row">
                        {this.state.pageStart != 0 && reversedReplies.length >= 1 && <button className="list-page-previous-button"
                                onClick={() => this.clickPagePreviousHandler()}>left</button>}
                        {reversedReplies.length - 5*this.state.pageStart >= 1 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==1 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(1)}>{this.state.pageStart+1}</button>}
                        {reversedReplies.length - 5*this.state.pageStart >= 6 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==2 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(2)}>{this.state.pageStart+2}</button>}
                        {reversedReplies.length - 5*this.state.pageStart >= 11 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==3 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(3)}>{this.state.pageStart+3}</button>}
                        {reversedReplies.length - 5*this.state.pageStart>= 16 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==4 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(4)}>{this.state.pageStart+4}</button>}
                        {reversedReplies.length - 5*this.state.pageStart>= 21 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==0 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(5)}>{this.state.pageStart+5}</button>}
                        {reversedReplies.length - 5*this.state.pageStart>= 26 && <button className="list-page-next-button"
                                disabled={false} onClick={() => this.clickPageNextHandler()}>right</button>}
                    </div>
                </div>
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
    isLogin: PropTypes.func,
    replies: PropTypes.array,
    commentId: PropTypes.string
};

export default connect(null, mapDispatchToProps)(Replies);
