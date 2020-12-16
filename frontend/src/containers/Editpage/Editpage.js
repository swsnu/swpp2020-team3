import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';

import * as actionCreators from '../../store/actions/index';

import Comments from '../comments/Comments';
import EditDishResult from './EditDishResult';
import './Editpage.css'
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
// Don't need editdishstep

const checkIngredients = (list) => {
    for(let i =0; i<list.length; i++){
        let item = list[i]
        if(item.price==0 || item.name.length==0 || item.igd_type=='' || item.amount==0 || (item.price_normalized && item.quantity==0)){
            return false;
        }
    } 
    return true;
}

const checkDescriptions = (list) => {
    // check
    return true
}

const checkOutput = (recipe) => {
    console.log(recipe)
    let message = ''
    if(!recipe.title)
        message = message.concat('제목을 입력해주세요.\n')
    if(!recipe.thumbnail)
        message = message.concat('대표사진을 추가해주세요.\n')
    if(!recipe.duration)
        message = message.concat('조리시간을 정해주세요.\n')
    if(!recipe.ingredient_list)
        message = message.concat('최소한 하나의 요리재료를 추가해주세요.\n')
    if(!recipe.description_list || !checkDescriptions(recipe.description_list))
        message = message.concat('조리 방법에 대한 설명을 추가해주세요.\n')
    if(recipe.ingredient_list && !checkIngredients(recipe.ingredient_list))
        message = message.concat('요리재료를 올바르게 채워주세요.')
    
    return message
}
class Editpage extends Component {
    state = {
        login_id : -1,
    }
    componentDidMount(){
        this.props.isLogin().then(response => {
            this.setState({
                login_id: response.login_id
            });
            this.props.getRecipe(this.props.match.params.id)
            .then((res) => {
                if(response.login_id != res['selectedRecipe'].author){
                    this.props.history.push('/detail-page/'+this.props.match.params.id);
                }
                this.setState({
                    title: res['selectedRecipe'].title,
                    price: res['selectedRecipe'].price,
                    duration: res['selectedRecipe'].duration,
                    rating: res['selectedRecipe'].rating,
                    likes: res['selectedRecipe'].likes,
                    category: res['selectedRecipe'].category,
                    summary: res['selectedRecipe'].summary,
                    ingredient_list: res['selectedRecipe'].ingredient_list,
                    thumbnail: res['selectedRecipe'].thumbnail,
                    description_list: res['selectedRecipe'].description_list,
                    photo_list: res['selectedRecipe'].photo_list,
                })
                let list = this.state.photo_list.map((item) => (
                    item
                ))
                this.setState({photo_list: list})
            })
        })
    }

    setParentState(key, value){
        console.log(key)
        this.setState({[key]: value})
    }
    
    addStepHandler(){
        let newList = this.state.description_list;
        newList.push('')
        this.setState({description_list: newList})
    }
    imageHandler(event, index){
        let file = event.target.files[0]
        let reader = new FileReader();
        reader.onloadend = () => {
            let newImgList = this.state.photo_list;
            newImgList[index] = reader.result
            this.setState({
                photo_list: newImgList,
            })
        }
        reader.readAsDataURL(file)
    }
    changeExplanation(event, index){
        let list = this.state.description_list
        list[index] = event.target.value
        this.setState({'description_list': list})
    }
    deleteStep(index){
        let newDList = this.state.description_list;
        let newIList = this.state.photo_list;
        newDList.splice(index, 1)
        newIList.splice(index, 1)
        this.setState({description_list: newDList})
        this.setState({photo_list: newIList})
    }

    onSubmit(){
        let pass = checkOutput(this.state);

        if(pass.length == 0)
            this.props.editRecipe(this.state, this.props.match.params.id).then(() => this.props.history.push('/detail-page/'+this.props.match.params.id))
        else {
            alert(pass)
        }
    }
    
    onCancel(){
        let ret = window.confirm("확인을 누르시면 작성하신 것들이 다 없어집니다. 그래도 뒤돌아가시겠습니까?")
        if(ret){
            this.props.history.goBack();
            return;
        }
    }

    render() {
        const author = this.props.recipe && this.props.recipe.author;
        const methodData = this.state.description_list && this.state.description_list.map((item, index) => ({img: this.state.photo_list[index], explanation:item}))
        const methods = methodData && methodData.map((item, index) => 
        <div className='edit-dish_step' key = {index}>
            <br/>
            <img src={item.img} width='600'/>
            <input id="imageHandler" type="file" accept='.jpg, .png, .jpeg' onChange={(event) => this.imageHandler(event, index)}/>
            <div className='dish_explanation'>
                <input id='edittitle' value={this.state.description_list[index]} onChange={(event) => {this.changeExplanation(event, index)}}/>
                <button id = "delete-button" onClick={() => this.deleteStep(index)}>Delete</button>
            </div>
            <br/>
        </div>)
        return (
            <div id = 'detailBackground'>
                <div className="Detailpage">
                    <div id = "detailBlock">
                        <EditDishResult id={this.props.match.params.id} updateState={(key,value) => this.setParentState(key, value)}/>
                        <div className='dish_method'>
                            <div id = 'detailtitle3'>{'조리 순서'}</div>
                            <div id = 'detailmethod'>
                                {methods}
                                <button id='editaddstep' onClick={()=> this.addStepHandler()}>Add step</button>
                            </div>
                        </div>

                        <button id="submit" onClick={() => this.onSubmit()}>Submit</button>
                        <button id="cancel" onClick={() => this.onCancel()}>Cancel</button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        recipe: state.rcp.selectedRecipe
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getRecipe: (id) => dispatch(actionCreators.getRecipe(id)),
        onGetIgrList: () => dispatch(actionCreators.getIngredients()),
        editRecipe: (data, id) => dispatch(actionCreators.editRecipe(data, id)),
        isLogin: () => dispatch(actionCreators.isLogin()),
    };
}

Editpage.propTypes = {
    getRecipe: PropTypes.func,
    deleteRecipe: PropTypes.func,
    recipe: PropTypes.object,
    match: PropTypes.object,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Editpage));