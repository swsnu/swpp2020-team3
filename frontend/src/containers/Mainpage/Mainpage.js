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
        check: null
    }

    componentDidMount() {
        this.props.onGetRandom()
    }

    toCreateHandler() {
        this.setState({check: 1})
        this.props.history.push('/create')
        window.location.reload()
    }


    render(){
        if(this.props.storedRecipes && this.props.storedRecipes[0]){
            let c = this.props.storedRecipes[0]
            if(this.props.storedRecipes[0].photo_list){
                let d = c.photo_list[0]
                let t = 'data:image/png;base64,'+ d
            }
        }

        let dailyrandomList;
        if(this.props.storedRecipes){
            dailyrandomList = this.props.storedRecipes.map((td) => {
                let d = 'data:image/png;base64,'+ td.thumbnail
                return (
                    <li className = 'random_content' id = 'r1'>
                        <DisplayRecipe history={this.props.history} id = {td.id} img = {<img src = {d} width='120' height='100'/>} title = {td.title} />
                    </li>
                )   
            })
        }
        
        const secondlist = this.state.secondList.map( (td) => {
            return (
                <li className = 'random_content' id = 'r2'>
                    <DisplayRecipe img = {<img src = {td.image}/>} title = {td.title} />
                </li>
            )   
        })
        const thirdlist = this.state.thirdList.map( (td) => {
            return (
                <li className = 'random_content' id = 'r3'>
                    <DisplayRecipe img = {<img src = {td.image} width='150'/>} title = {td.title} />
                </li>
            )   
        })

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
                                    <div>{'click to create'}</div>
                                </li>
                            </ul>
                        </div>
                        <div className = 'secondBlock' >
                            <ul className = 'second_list'>
                                <div className = 'list_title' id = 'title2' >{'최근 인기 레시피'}</div>
                                {secondlist}
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
    }
}
  
const mapDispatchToProps = dispatch => {
    return {
        onGetRandom: () =>
            dispatch(actionCreators.getRandom()),
        onGetUser: (td) =>
            dispatch(actionCreators.getUser(td)),
    }
}

Mainpage.propTypes = {
    onGetRandom: PropTypes.func,
    storedRecipes: PropTypes.array,
    history: PropTypes.object
};

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Mainpage));
