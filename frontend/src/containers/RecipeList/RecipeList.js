import React, {Component} from 'react';

//TODO:
//      needs "recipe" component
//      implement search handler
class RecipeList extends Component{

    state = {
        category : 0,
        minCost : 0,
        maxCost : 2000,
        minTime : 0,
        maxTime : 2000,
        searchMode : "relevance",
        searchOptionsClicked : false,
        pageStart : 0,
        currentPage : 1,
        numRecipe : 39,
    }

    clickSearchModeHandler = searchmode => {
        this.setState({searchMode: searchmode});
    }

    clickCategoryHandler(id){
        this.setState({category : id})
    }

    clickOptionsHandler = () => {
        this.setState({searchOptionsClicked: !(this.state.searchOptionsClicked)});
    }

    clickRecipeHandler = recipe => {
        this.props.history.push('/recipe/'+recipe);
    }

    clickSearchHandler = () => {

    }

    clickLeftPageHandler = () => {
        this.setState({pageStart: this.state.pageStart-5});
        this.setState({currentPage: this.state.pageStart-4});
    }

    clickPageHandler = (id) => {
        this.setState({currentPage: this.state.pageStart+id});
    }

    clickRightPageHandler = () => {
        this.setState({pageStart: this.state.pageStart+5});
        this.setState({currentPage: this.state.pageStart+6});
    }

    render(){
        return(
            <div className = "RecipeList">
                <div className = "category-search">
                    <div className = "categories">
                        <div className = "row">
                            <button onClick={() => this.clickCategoryHandler(1)}>양식</button>
                            <button onClick={() => this.clickCategoryHandler(2)}>한식</button>
                            <button onClick={() => this.clickCategoryHandler(3)}>중식</button>
                        </div>
                        <div className = "row">
                            <button onClick={() => this.clickCategoryHandler(4)}>일식</button>
                            <button onClick={() => this.clickCategoryHandler(5)}>인스턴트</button>
                            <button onClick={() => this.clickCategoryHandler(6)}>최저가</button>
                        </div>
                    </div>
                    <div className = "constraints">
                        <div className = "cost">
                            <p>Cost($)</p>
                            <input className = "min-cost" value = {this.state.minCost} 
                                   onChange={(event) => this.setState({minCost: event.target.value})}></input>
                            <input className = "max-cost" value = {this.state.maxCost} 
                                   onChange={(event) => this.setState({maxCost: event.target.value})}></input>
                        </div>
                        <div className = "time">
                            <p>Time(min)</p>
                            <input className = "min-time" value = {this.state.minTime} 
                                   onChange={(event) => this.setState({minTime: event.target.value})}></input>
                            <input className = "max-time" value = {this.state.maxTime} 
                                   onChange={(event) => this.setState({maxTime: event.target.value})}></input>
                        </div>
                    </div>
                    <div className = "search-options">
                        <div className = "options">
                            <button className ="sorted-by" onClick={() => this.clickOptionsHandler()}>sorted by</button>
                            {this.state.searchOptionsClicked && <button className ="relevance" onClick={() => this.clickSearchModeHandler("relevance")}>relevance</button>}
                            {this.state.searchOptionsClicked && <button className ="most-liked" onClick={() => this.clickSearchModeHandler("most-liked")}>most liked</button>}
                            {this.state.searchOptionsClicked && <button className ="most-recent" onClick={() => this.clickSearchModeHandler("most-recent")}>most recent</button>}
                        </div>
                        <div className = "search">
                            <button className = "search-button" onClick={() => this.clickSearchHandler()}>search</button>
                        </div>
                    </div>
                </div>
                <div className = "recipes">
                    <div className = "row">
                        {((this.state.currentPage-1)*6+1) <= this.state.numRecipe &&
                            <button onClick={() => this.clickRecipeHandler(1)}>{'recipe'+((this.state.currentPage-1)*6+1)}</button>} 
                    	{((this.state.currentPage-1)*6+2) <= this.state.numRecipe &&
                            <button onClick={() => this.clickRecipeHandler(2)}>{'recipe'+((this.state.currentPage-1)*6+2)}</button>} 
                        {((this.state.currentPage-1)*6+3) <= this.state.numRecipe &&
                            <button onClick={() => this.clickRecipeHandler(3)}>{'recipe'+((this.state.currentPage-1)*6+3)}</button>} 
                    </div>
                    <div className = "row">
                        {((this.state.currentPage-1)*6+4) <= this.state.numRecipe &&
                            <button onClick={() => this.clickRecipeHandler(4)}>{'recipe'+((this.state.currentPage-1)*6+4)}</button>} 
                        {((this.state.currentPage-1)*6+5) <= this.state.numRecipe &&
                            <button onClick={() => this.clickRecipeHandler(5)}>{'recipe'+((this.state.currentPage-1)*6+5)}</button>} 
                        {((this.state.currentPage-1)*6+6)<= this.state.numRecipe &&
                            <button onClick={() => this.clickRecipeHandler(6)}>{'recipe'+((this.state.currentPage-1)*6+6)}</button>} 
                    </div>
                </div>
                <div className = "pages">
                    <div className = "page">
                        <p>Page</p>
                    </div>
                    <div className = "row">
                        <button disabled ={this.state.pageStart == 0} onClick={() => this.clickLeftPageHandler()}>left</button>
                        {((this.state.pageStart)*6) <= this.state.numRecipe && <button onClick={() => this.clickPageHandler(1)}>{this.state.pageStart+1}</button>}
                        {((this.state.pageStart+1)*6) <= this.state.numRecipe && <button onClick={() => this.clickPageHandler(2)}>{this.state.pageStart+2}</button>}
                        {((this.state.pageStart+2)*6) <= this.state.numRecipe && <button onClick={() => this.clickPageHandler(3)}>{this.state.pageStart+3}</button>}
                        {((this.state.pageStart+3)*6) <= this.state.numRecipe && <button onClick={() => this.clickPageHandler(4)}>{this.state.pageStart+4}</button>}
                        {((this.state.pageStart+4)*6) <= this.state.numRecipe && <button onClick={() => this.clickPageHandler(5)}>{this.state.pageStart+5}</button>}
                        <button disabled={(this.state.pageStart+5)*6 > this.state.numRecipe} onClick={() => this.clickRightPageHandler()}>right</button>
                    </div>
                </div>
            </div>

        )        
    }
};

export default RecipeList;
