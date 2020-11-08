import React, {Component} from 'react';
import DisplayRecipe from '../../components/Recipe/DisplayRecipe'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import './Mainpage.css';
import * as actionCreators from '../../store/actions/index'
import Recipe from '../../components/Recipe/Recipe';
class Mainpage extends Component{

    state = {
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
            {image: require('../../Image/item.png'), title: 'item1'}, 
            {image: require('../../Image/item.png'), title: 'item2'}, 
            {image: require('../../Image/item.png'), title: 'item3'},
            {image: require('../../Image/item.png'), title: 'item4'}, 
            {image: require('../../Image/item.png'), title: 'item5'}
        ],
    }

    componentDidMount() {
        this.props.onGetRecipes(this.state.search);
    }

    toCreateHandler() {
        this.props.history.push('/create')
        window.location.reload()
    }

    render(){
        const recipes = this.props.storedRecipes.map((recipe) => {
            return (
                <Recipe
                    author={recipe.author}
                    abstraction={recipe.summary}
                    title={recipe.title}
                    rating={recipe.rating}
                    time={recipe.time}
                    cost={recipe.price}
                    likes={recipe.likes}
                    clickedRecipe={() => this.clickRecipeHandler(recipe.id)}
                    clickedLikes={null}
                />
            );
        });

        const dailyrandomList = this.state.dailyrandomList.map( (td) => {
            return (
                <li className = 'random_content'>
                    <DisplayRecipe img = {<img src = {td.image}/>} title = {td.title} />
                </li>
            )   
        })
        const secondlist = this.state.secondList.map( (td) => {
            return (
                <li className = 'random_content'>
                    <DisplayRecipe img = {<img src = {td.image}/>} title = {td.title} />
                </li>
            )   
        })
        const thirdlist = this.state.thirdList.map( (td) => {
            return (
                <li className = 'random_content'>
                    <DisplayRecipe img = {<img src = {td.image}/>} title = {td.title} />
                </li>
            )   
        })

        return(
            <div className = 'MainpageBackground'>
                <div className = 'Mainpage'>
                    <div className = 'firstBlock'>
                        <div className = 'list_title'>{'오늘의 랜덤 레시피  &   레시피 등록하기'}</div>
                        <ul className = 'first_list'> 
                            {dailyrandomList}
                            <li className = 'toCreate'>
                                <div><img src = {require('../../Image/toCreate.png')} onClick = {() => this.toCreateHandler()}/></div>
                                <div>{'click to create'}</div>
                            </li>
                        </ul>
                    </div>
                    <div className = 'secondBlock'>
                        <div className = 'list_title'>{'최근 인기 레시피'}</div>
                        <ul className = 'second_list'>
                            {secondlist}
                        </ul>
                    </div>
                    <div className = 'thirdBlock'>
                        <div className = 'list_title'>{'내 입맛 맞춤 레시피'}</div>
                        <ul className = 'third_list'>
                        {thirdlist}
                        </ul>
                    </div>
                    <div> {recipes}</div>
                </div>
            </div>
        )        
    }
};

const mapStateToProps = state => {
    return {
        storedRecipes: state.rcp.recipes,
        getuser: state.rcp.getuser,
    };
}
  
const mapDispatchToProps = dispatch => {
    return {
        onGetRecipes: (searchSettings) =>
            dispatch(actionCreators.getRecipes(searchSettings)),
        onGetUser: (td) =>
            dispatch(actionCreators.getUser(td)),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Mainpage));
