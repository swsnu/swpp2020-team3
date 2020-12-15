import React, {Component} from 'react';
import DisplayRecipe from '../../components/Recipe/DisplayRecipe'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import './Mainpage.css';
import * as actionCreators from '../../store/actions/index'
import PropTypes from "prop-types";

class Mainpage extends Component{

    state={
        search: {category1: false,
            category2: false,
            category3: false,
            category4: false,
            category5: false,
            category6: false,
    
            minCost : 0,
            maxCost : 20000,
            minTime : 0,
            maxTime : 20,
            searchWord : "",
    
            pageStart : 0,
            searchMode : "most-liked",
            searchOptionsClicked : false},
        dailyrandomList: [
            {image: require('../../Image/item.png'), title: 'item1'}, 
            {image: require('../../Image/item.png'), title: 'item2'}, 
            {image: require('../../Image/item.png'), title: 'item3'},
            {image: require('../../Image/item.png'), title: 'item4'}, 
        ],
        secondList : [
            {image: require('../../Image/item.png'), title: 'item1'}, 
            {image: require('../../Image/item.png'), title: 'item2'}, 
            {image: require('../../Image/item.png'), title: 'item3'},
            {image: require('../../Image/item.png'), title: 'item4'}, 
            {image: require('../../Image/item.png'), title: 'item5'}
        ],
        thirdList : [
            {image: require('../../Image/F4201_4.jpg'), title: 'item1'}, 
            {image: require('../../Image/F4201_4.jpg'), title: 'item2'}, 
            {image: require('../../Image/item.png'), title: 'item3'},
        ],
        check: null,
        login_id: -1,
    }

    componentDidMount() {
        this.props.onGetRandom()
        this.props.onGetHot()
        this.props.isLogin().then(res => {
            console.log(res)
            this.setState({
                login_id: res.login_id
            })
            if(res.login_id != -1){
                this.props.getMls(res.login_id).then( res => {
                    console.log(res)
                    let new_list = res.mlRecipes.map((recipe, index) => ({'image':recipe.thumbnail, 'id':recipe.id, 'title': recipe.title}))
                    this.setState({thirdList: new_list})
                })
            }
        })
    }

    toCreateHandler() {
        this.setState({check: 1})
        this.props.history.push('/create')
        window.location.reload()
    }


    render(){

        let dailyrandomList;
        if(this.props.storedRecipes){
            dailyrandomList = this.props.storedRecipes.map((td) => {
                let d = td.thumbnail
                return (
                    <li key={td.id} className = 'random_content' id = 'r1'>
                        <DisplayRecipe history={this.props.history} id = {td.id} img = {<img src = {d} width='120' height='100'/>} title = {td.title} />
                    </li>
                )   
            })
        }
        let hotlist;
        if(this.props.hotRecipes){
            hotlist= this.props.hotRecipes.map( (td) => {
                let d = td.thumbnail
                return (
                    <li key={td.id} className = 'random_content' id = 'r2'>
                        <DisplayRecipe history={this.props.history} id = {td.id} img = {<img src = {d} width='120' height='100'/>} title = {td.title} />
                    </li>
                )   
            })
        }
        let thirdlist = this.state.thirdList.map( (td) => {
            let d = td.thumbnail
            return (
                <li key={td.id} className = 'random_content' id = 'r3'>
                    <DisplayRecipe history={this.props.history} id = {td.id} img = {<img src = {d} width='120' height='100'/>} title = {td.title} />
                </li>
            )   
        })
        console.log(this.props.mlRecipes)
        if(this.state.login_id < 1 || !this.props.mlRecipes) {
            thirdlist = hotlist
        }
        return(
            <div className = 'MainpageBackground'>
                <div className = 'Mainpage'>
                    <div className = 'mainblock'>
                        <div className = 'firstBlock'>
                            <ul className = 'first_list'>
                                <div className = 'list_title' id = 'title1'>{'오늘의 랜덤 레시피  &   레시피 등록하기'}</div> 
                                {dailyrandomList}
                                <li className = 'toCreate'>
                                    <div><img src = {require('../../Image/toCreate.png')} onClick = {() => this.toCreateHandler()}/></div>
                                    <div>{'레시피 만들기'}</div>
                                </li>
                            </ul>
                        </div>
                        <div className = 'secondBlock' >
                            <ul className = 'second_list'>
                                <div className = 'list_title' id = 'title2' >{'최근 인기 레시피'}</div>
                                {hotlist}
                            </ul>
                        </div>
                        <div className = 'thirdBlock'>
                            <ul className = 'third_list'>
                            <div className = 'list_title' id = 'title3'>{'내 입맛 맞춤 레시피'}</div>
                            {thirdlist}
                            </ul>
                        </div>
                        <div> </div>
                    </div>
                </div>
            </div>
        )        
    }
}

const mapStateToProps = state => {
    return {
        storedRecipes: state.rcp.randomRecipe,
        hotRecipes: state.rcp.hotRecipe,
        mlRecipes: state.rcp.mlRecipes,
    }
}
  
const mapDispatchToProps = dispatch => {
    return {
        onGetRandom: () =>
            dispatch(actionCreators.getRandom()),
        onGetUser: (td) =>
            dispatch(actionCreators.getUser(td)),
        onGetHot: () =>
            dispatch(actionCreators.getHot()),
        getMls: (id) => dispatch(actionCreators.getMl(id)),
        isLogin: () => dispatch(actionCreators.isLogin()),

    }
}

Mainpage.propTypes = {
    onGetRandom: PropTypes.func,
    storedRecipes: PropTypes.array,
    hotRecipes: PropTypes.array,
    history: PropTypes.object
};

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Mainpage));
