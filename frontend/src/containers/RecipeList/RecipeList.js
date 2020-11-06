import React, {Component} from 'react';
import Recipe from '../../components/Recipe/Recipe';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { withRouter } from 'react-router-dom';
import * as actionCreators from '../../store/actions/index';
import queryString from 'query-string';

//TODO:
//      more search options

class RecipeList extends Component{

    state = {
        category1: false,
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
        searchOptionsClicked : false,
    }
    
    componentDidMount() {
        this.props.onGetRecipes(this.state);
    }
    
    componentDidUpdate(prevProps, prevState){
        if(prevState){
            if(this.state.pageStart !== prevState.pageStart){
                this.props.onGetRecipes(this.state);
            }
        }
            
    }
    
    clickSearchModeHandler = searchmode => {
        this.setState({searchMode: searchmode});
        this.setState({searchOptionsClicked: false});
    }

    clickCategoryHandler(id){
        if(id == 1) this.setState({category1 : !this.state.category1});
        else if(id == 2) this.setState({category2 : !this.state.category2});
        else if(id == 3) this.setState({category3 : !this.state.category3});
        else if(id == 4) this.setState({category4 : !this.state.category4});
        else if(id == 5) this.setState({category5 : !this.state.category5});
        else this.setState({category6 : !this.state.category6});
    }

    clickOptionsHandler = () => {
        this.setState({searchOptionsClicked: !(this.state.searchOptionsClicked)});
    }

    clickRecipeHandler = id => {
        this.props.history.push('/recipe/'+id);
    }

    clickSearchHandler = () => {
        this.props.onGetRecipes(this.state);
    }

    clickPagePreviousHandler = (pageNum) => {
        let pageHeadNum = (pageNum / 5) * 5;
        this.setState({pageStart: pageHeadNum-5});
        this.props.history.push('/search?id='+(pageHeadNum-4)); 
    }

    clickPageNumberHandler = (pageNum,id) => {
        let pageHeadNum = (pageNum / 5) * 5;
        this.props.history.push(`/search?id=${pageHeadNum+id}`);
    }

    clickPageNextHandler = (pageNum) => {
        let pageHeadNum = (pageNum / 5) * 5;
        this.setState({pageStart: pageHeadNum+5});
        this.props.history.push('/search?id='+(pageHeadNum+6));
    }



    render(){
        
        let {search} = this.props.location;
        let queryObj = queryString.parse(search);
        let {pageNum, mode} = queryObj;
        if(!pageNum) pageNum=1;
        let pageHeadNum = Math.floor(pageNum / 5) * 5;

        let slicedRecipes;
        if(pageNum%5 === 0)
            slicedRecipes = this.props.storedRecipes.slice(10*(pageNum%5-1), 10*5);
        else
            slicedRecipes = this.props.storedRecipes.slice(10*(pageNum%5-1), 10*(pageNum%5));
        const recipes = slicedRecipes.map((recipe) => {
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

        return(
            <div className = "RecipeList">
                <div className = "category-search">
                    <div className = "categories">
                        <div className = "row">
                            <button className="category-select-button" onClick={() => this.clickCategoryHandler(1)}>양식</button>
                            <button className="category-select-button" onClick={() => this.clickCategoryHandler(2)}>한식</button>
                            <button className="category-select-button" onClick={() => this.clickCategoryHandler(3)}>중식</button>
                        </div>
                        <div className = "row">
                            <button className="category-select-button" onClick={() => this.clickCategoryHandler(4)}>일식</button>
                            <button className="category-select-button" onClick={() => this.clickCategoryHandler(5)}>인스턴트</button>
                            <button className="category-select-button" onClick={() => this.clickCategoryHandler(6)}>최저가</button>
                        </div>
                    </div>
                    <div className = "constraints">
                        <div className = "cost">
                            <p>Cost(won)</p>
                            <input className = "min-cost-input" value = {this.state.minCost} 
                                   onChange={(event) => this.setState({minCost: event.target.value})}></input>
                            <input className = "max-cost-input" value = {this.state.maxCost} 
                                   onChange={(event) => this.setState({maxCost: event.target.value})}></input>
                        </div>
                        <div className = "time">
                            <p>Time(min)</p>
                            <input className = "min-time-input" value = {this.state.minTime} 
                                   onChange={(event) => this.setState({minTime: event.target.value})}></input>
                            <input className = "max-time-input" value = {this.state.maxTime} 
                                   onChange={(event) => this.setState({maxTime: event.target.value})}></input>
                        </div>
                        <div className = "row">
                            <p>gum sak eo</p>
                            <input className = "search-word-input" value = {this.state.searchWord} 
                                   onChange={(event) => this.setState({searchWord: event.target.value})}></input>
                        </div>
                    </div>
                    <div className = "search-options">
                        <div className = "options">
                            <button className ="search-options-button" onClick={() => this.clickOptionsHandler()}>sorted by</button>
                            {this.state.searchOptionsClicked && <button className ="search-mode-select-button"
                                    onClick={() => this.clickSearchModeHandler("relevance")}>relevance</button>}
                            {this.state.searchOptionsClicked && <button className ="search-mode-select-button"
                                    onClick={() => this.clickSearchModeHandler("likes")}>most liked</button>}
                            {this.state.searchOptionsClicked && <button className ="search-mode-select-button"
                                    onClick={() => this.clickSearchModeHandler("uploaded date")}>most recent</button>}
                            {this.state.searchOptionsClicked && <button className ="search-mode-select-button"
                                    onClick={() => this.clickSearchModeHandler("rating")}>most recent</button>}
                            {this.state.searchOptionsClicked && <button className ="search-mode-select-button"
                                    onClick={() => this.clickSearchModeHandler("cost")}>most recent</button>}
                        </div>
                        <div className = "search">
                            <button className = "search-confirm-button" onClick={() => this.clickSearchHandler()}>search</button>
                        </div>
                    </div>
                </div>
                <div className = "recipes">
                    {recipes}
                </div>
                <div className = "pages">
                    <div className = "page">
                        <p>Page</p>
                    </div>
                    <div className = "row">
                        <button className="list-page-previous-button"
                                disabled ={pageHeadNum == 0} onClick={() => this.clickPagePreviousHandler(pageNum)}>left</button>
                        {this.props.storedRecipes.length >= 1 && <button className="list-page-number-button"
                                onClick={() => this.clickPageNumberHandler(pageNum,1)}>{pageHeadNum+1}</button>}
                        {this.props.storedRecipes.length >= 11 && <button className="list-page-number-button"
                                onClick={() => this.clickPageNumberHandler(pageNum,2)}>{pageHeadNum+2}</button>}
                        {this.props.storedRecipes.length >= 21 && <button className="list-page-number-button"
                                onClick={() => this.clickPageNumberHandler(pageNum,3)}>{pageHeadNum+3}</button>}
                        {this.props.storedRecipes.length >= 31 && <button className="list-page-number-button"
                                onClick={() => this.clickPageNumberHandler(pageNum,4)}>{pageHeadNum+4}</button>}
                        {this.props.storedRecipes.length >= 41 && <button className="list-page-number-button"
                                onClick={() => this.clickPageNumberHandler(pageNum,5)}>{pageHeadNum+5}</button>}
                        {this.props.storedRecipes.length >= 51 && <button className="list-page-next-button"
                                disabled={false} onClick={() => this.clickPageNextHandler(pageNum)}>right</button>}
                    </div>
                </div>
            </div>

        )        
    }
};


const mapStateToProps = state => {
    return {
        storedRecipes: state.rcp.recipes,
    };
}
  
const mapDispatchToProps = dispatch => {
    return {
        onGetRecipes: (searchSettings) =>
            dispatch(actionCreators.getRecipes(searchSettings)),
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(RecipeList));