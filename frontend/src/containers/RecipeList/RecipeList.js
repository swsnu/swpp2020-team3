import React, {Component} from 'react';
import Recipe from '../../components/Recipe/Recipe';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { withRouter } from 'react-router-dom';
import * as actionCreators from '../../store/actions/index';
import queryString from 'query-string';
import './RecipeList.css'
//TODO:
//      Recipe component 바꾸기 (image 넣기, 구조 등)
//      중간 이후에 할 일 : like/unlike recipe User model, authentication?

class RecipeList extends Component{

    state = {
        category1: true,
        category2: true,
        category3: true,
        category4: true,
        category5: true,
        category6: true,

        minCost : 0,
        maxCost : Number.MAX_SAFE_INTEGER,
        minTime : 0,
        maxTime : Number.MAX_SAFE_INTEGER,
        searchWord : "",

        pageStart : 0,
        pageNumber: 1,
        searchMode : "likes",
        searchOptionsClicked : false,
    }
    
    componentDidMount() {
        
        const {search} = this.props.location;
        if(search){
            const query = queryString.parse(search);
            const {minPrice,maxPrice, keyword} = query;
            this.setState({minCost: minPrice}); // parse to int
            this.setState({maxCost: maxPrice});
            this.setState({searchWord: keyword});
        }
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

    clickCategoryHandler = (event,id) => {
        if(id == 1){
            this.setState({category1 : !this.state.category1});
        }
        else if(id == 2){
            this.setState({category2 : !this.state.category2});
        }
        else if(id == 3){
            this.setState({category3 : !this.state.category3});
        }
        else if(id == 4){
            this.setState({category4 : !this.state.category4});
        }
        else if(id == 5){
            this.setState({category5 : !this.state.category5});
        }
        else{
            this.setState({category6 : !this.state.category6});
        }
    }

    clickOptionsHandler = () => {
        this.setState({searchOptionsClicked: !(this.state.searchOptionsClicked)});
    }

    clickRecipeHandler = id => {
        this.props.history.push('/recipe/'+id);
    }

    clickSearchHandler = () => {
        this.props.history.push(`/search?minPrice=${this.state.minCost}&maxPrice=${this.state.maxCost}&keyword=${this.state.searchWord}`);
        this.props.onGetRecipes(this.state);
    }

    clickPagePreviousHandler = () => {
        this.setState({pageStart: this.state.pageStart-5});
        this.setState({pageNumber: this.state.pageStart-4});
    }

    clickPageNumberHandler = (event,id) => {
        this.setState({pageNumber: this.state.pageStart+id});
    }

    clickPageNextHandler = () => {
        this.setState({pageStart: this.state.pageStart+5});
        this.setState({pageNumber: this.state.pageStart+6});
    }



    render(){

        let slicedRecipes;
        if(this.state.pageNumber%5 === 0)
            slicedRecipes = this.props.storedRecipes.slice(10*(this.state.pageNumber%5-1), 10*5);
        else
            slicedRecipes = this.props.storedRecipes.slice(10*(this.state.pageNumber%5-1), 10*(this.state.pageNumber%5));
        const recipes = slicedRecipes.map((recipe) => {
            return (
                <Recipe
                    author={recipe.author__username}
                    thumbnail={'data:image/png;base64,'+recipe.thumbnail}
                    title={recipe.title}
                    rating={recipe.rating}
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
                            <button className="category-select-button" style = {{backgroundColor: this.state.category1 ? "grey" : null}}
                                onClick={(event) => this.clickCategoryHandler(event,1)}>양식</button>
                            <button className="category-select-button" style = {{backgroundColor: this.state.category2 ? "grey" : null}}
                                onClick={(event) => this.clickCategoryHandler(event,2)}>한식</button>
                            <button className="category-select-button" style = {{backgroundColor: this.state.category3 ? "grey" : null}}
                                onClick={(event) => this.clickCategoryHandler(event,3)}>중식</button>
                        </div>
                        <div className = "row">
                            <button className="category-select-button" style = {{backgroundColor: this.state.category4 ? "grey" : null}}
                                onClick={(event) => this.clickCategoryHandler(event,4)}>일식</button>
                            <button className="category-select-button" style = {{backgroundColor: this.state.category5 ? "grey" : null}}
                            onClick={(event) => this.clickCategoryHandler(event,5)}>인스턴트</button>
                            <button className="category-select-button" style = {{backgroundColor: this.state.category6 ? "grey" : null}}
                            onClick={(event) => this.clickCategoryHandler(event,6)}>최저가</button>
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
                        <div className = "keywords">
                            <p>Keywords</p>
                            <input className = "search-word-input" value = {this.state.searchWord} 
                                   onChange={(event) => this.setState({searchWord: event.target.value})}></input>
                        </div>
                    </div>
                    <div className = "search-options" id = "list-option">
                        <div id = "option_label"> 분류 </div>
                            <div className = "options">
                                <button className ="search-options-button" onClick={() => this.clickOptionsHandler()}>sorted by</button>
                                {this.state.searchOptionsClicked && <button className ="search-mode-select-button"
                                        onClick={() => this.clickSearchModeHandler("relevance")}>relevance</button>}
                                {this.state.searchOptionsClicked && <button className ="search-mode-select-button"
                                        onClick={() => this.clickSearchModeHandler("likes")}>likes</button>}
                                {this.state.searchOptionsClicked && <button className ="search-mode-select-button"
                                        onClick={() => this.clickSearchModeHandler("uploaded date")}>most recent</button>}
                                {this.state.searchOptionsClicked && <button className ="search-mode-select-button"
                                        onClick={() => this.clickSearchModeHandler("rating")}>rating</button>}
                                {this.state.searchOptionsClicked && <button className ="search-mode-select-button"
                                        onClick={() => this.clickSearchModeHandler("cost")}>cost</button>}
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
                        {this.props.storedRecipes.length >= 1 && <button className="list-page-previous-button"
                                disabled ={this.state.pageStart == 0} onClick={() => this.clickPagePreviousHandler()}>left</button>}
                        {this.props.storedRecipes.length >= 1 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==1 ? "grey" : null}}
                                onClick={(event) => this.clickPageNumberHandler(event,1)}>{this.state.pageStart+1}</button>}
                        {this.props.storedRecipes.length >= 11 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==2 ? "grey" : null}}
                                onClick={(event) => this.clickPageNumberHandler(event,2)}>{this.state.pageStart+2}</button>}
                        {this.props.storedRecipes.length >= 21 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==3 ? "grey" : null}}
                                onClick={(event) => this.clickPageNumberHandler(event,3)}>{this.state.pageStart+3}</button>}
                        {this.props.storedRecipes.length >= 31 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==4 ? "grey" : null}}
                                onClick={(event) => this.clickPageNumberHandler(event,4)}>{this.state.pageStart+4}</button>}
                        {this.props.storedRecipes.length >= 41 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==0 ? "grey" : null}}
                                onClick={(event) => this.clickPageNumberHandler(event,5)}>{this.state.pageStart+5}</button>}
                        {this.props.storedRecipes.length >= 51 && <button className="list-page-next-button"
                                disabled={false} onClick={() => this.clickPageNextHandler()}>right</button>}
                    </div>
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