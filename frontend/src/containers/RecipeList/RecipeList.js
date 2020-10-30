import React, {Component} from 'react';
import Recipe from '../../components/Recipe/Recipe'

//TODO:
//      should select categories simultaneously 
//      implement search handler
class RecipeList extends Component{

    state = {
        recipes: [],

        categories : [false,false,false,false,false,false],

        minCost : 0,
        maxCost : 20000,
        minTime : 0,
        maxTime : 20,

        searchMode : "relevance",
        searchOptionsClicked : false,
        search : 0,

        pageStart : 0,
        currentPage : 1,
    }
    /*
    componentDidMount() {
        this.props.onGetRecipes();
    }
    */
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
        this.setState({search: this.state.search+1});
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
        const recipes = this.state.recipes.map((recipe) => {
        //const recipes = this.props.storedRecipes.map((recipe) => {
            return (
                <Recipe
                    author={recipe.author}
                    abstraction={recipe.abstraction}
                    title={recipe.title}
                    rating={recipe.rating}
                    time={recipe.time}
                    cost={recipe.cost}
                    likes={recipe.likes}
                    clickedRecipe={this.clickRecipeHandler(recipe.id)}
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
                        <button className="list-page-number-button"
                                onClick={() => this.clickPageNumberHandler(1)}>{this.state.pageStart+1}</button>
                        <button className="list-page-number-button"
                                onClick={() => this.clickPageNumberHandler(2)}>{this.state.pageStart+2}</button>
                        <button className="list-page-number-button"
                                onClick={() => this.clickPageNumberHandler(3)}>{this.state.pageStart+3}</button>
                        <button className="list-page-number-button"
                                onClick={() => this.clickPageNumberHandler(4)}>{this.state.pageStart+4}</button>
                        <button className="list-page-number-button"
                                onClick={() => this.clickPageNumberHandler(5)}>{this.state.pageStart+5}</button>
                        <button className="list-page-next-button"
                                disabled={false} onClick={() => this.clickPageNextHandler()}>right</button>
                    </div>
                </div>
            </div>

        )        
    }
};

/*
const mapStateToProps = state => {
    return {
        storedRecipes: state.rcp.recipes,
    };
}
  
const mapDispatchToProps = dispatch => {
    return {
        onGetRecipes: () =>
            dispatch(actionCreators.getRecipes()),
    }
}
*/

//export default connect(mapStateToProps,mapDispatchToProps)(withRouter(RecipeList));
export default RecipeList;