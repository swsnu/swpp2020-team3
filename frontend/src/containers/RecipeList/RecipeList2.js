import React, {Component} from 'react';
import Recipe from '../../components/Recipe/Recipe';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { withRouter } from 'react-router-dom';
import * as actionCreators from '../../store/actions/index';
import queryString from 'query-string';

//TODO:
//      page query : currentPage, searchmode
//      implement search handler (options/sort)

class RecipeList extends Component{

    state = {
        categories : [false,false,false,false,false,false],

        minCost : 0,
        maxCost : 20000,
        minTime : 0,
        maxTime : 20,

        searchMode : "relevance",
        searchOptionsClicked : false,

        pageStart : 0,
        currentPage : 1,
    }
    
    componentDidMount() {
        this.props.onGetRecipes(this.state.pageStart,this.state.searchMode);
    }
    
    componentDidUpdate(prevProps, prevState){
        
        if(prevState){
            if(this.state.pageStart !== prevState.pageStart){
                this.props.onGetRecipes(this.state.pageStart,this.state.searchMode);
            }
        }
            
    }
    
    clickSearchModeHandler = searchmode => {
        this.setState({searchMode: searchmode});
    }

    clickCategoryHandler(id){
        let modifiedCategories = this.state.categories;
        modifiedCategories[id-1] = !modifiedCategories[id-1];
        this.setState({category : modifiedCategories});
    }

    clickOptionsHandler = () => {
        this.setState({searchOptionsClicked: !(this.state.searchOptionsClicked)});
    }

    clickRecipeHandler = id => {
        this.props.history.push('/recipe/'+id);
    }

    clickSearchHandler = () => {
        window.location.reload();
    }

    clickPagePreviousHandler = () => {
        this.setState({pageStart: this.state.pageStart-5});
        this.setState({currentPage: this.state.pageStart-4});   
    }

    clickPageNumberHandler = (id) => {
        this.setState({currentPage: this.state.pageStart+id});
    }

    clickPageNextHandler = () => {
        this.setState({pageStart: this.state.pageStart+5});
        this.setState({currentPage: this.state.pageStart+6});
    }



    render(){
        /*
        const {search} = this.props.location;
        const queryObj = queryString.parse(search);
        const {id, mode} = queryObj;
        */
        let slicedRecipes;
        if(this.state.currentPage%5 === 0)
            slicedRecipes = this.props.storedRecipes.slice(10*(this.state.currentPage%5-1), 10*5);
        else
            slicedRecipes = this.props.storedRecipes.slice(10*(this.state.currentPage%5-1), 10*(this.state.currentPage%5));
        const recipes = slicedRecipes.map((recipe) => {
            return (
                <Recipe
                    author={recipe.author}
                    abstraction={recipe.summary}
                    title={recipe.title}
                    rating={recipe.rating}
                    //time={recipe.time}
                    time={0}
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
                    </div>
                    <div className = "search-options">
                        <div className = "options">
                            <button className ="search-options-button" onClick={() => this.clickOptionsHandler()}>sorted by</button>
                            {this.state.searchOptionsClicked && <button className ="search-mode-select-button"
                                    onClick={() => this.clickSearchModeHandler("relevance")}>relevance</button>}
                            {this.state.searchOptionsClicked && <button className ="search-mode-select-button"
                                    onClick={() => this.clickSearchModeHandler("most-liked")}>most liked</button>}
                            {this.state.searchOptionsClicked && <button className ="search-mode-select-button"
                                    onClick={() => this.clickSearchModeHandler("most-recent")}>most recent</button>}
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
                                disabled ={this.state.pageStart == 0} onClick={() => this.clickPagePreviousHandler()}>left</button>
                        {this.props.storedRecipes.length >= 1 && <button className="list-page-number-button"
                                onClick={() => this.clickPageNumberHandler(1)}>{this.state.pageStart+1}</button>}
                        {this.props.storedRecipes.length >= 11 && <button className="list-page-number-button"
                                onClick={() => this.clickPageNumberHandler(2)}>{this.state.pageStart+2}</button>}
                        {this.props.storedRecipes.length >= 21 && <button className="list-page-number-button"
                                onClick={() => this.clickPageNumberHandler(3)}>{this.state.pageStart+3}</button>}
                        {this.props.storedRecipes.length >= 31 && <button className="list-page-number-button"
                                onClick={() => this.clickPageNumberHandler(4)}>{this.state.pageStart+4}</button>}
                        {this.props.storedRecipes.length >= 41 && <button className="list-page-number-button"
                                onClick={() => this.clickPageNumberHandler(5)}>{this.state.pageStart+5}</button>}
                        {this.props.storedRecipes.length >= 51 && <button className="list-page-next-button"
                                disabled={false} onClick={() => this.clickPageNextHandler()}>right</button>}
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
        onGetRecipes: (pageID, searchMode) =>
            dispatch(actionCreators.getRecipes(pageID, searchMode)),
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(RecipeList));