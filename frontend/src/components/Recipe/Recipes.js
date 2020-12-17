import React, { Component } from 'react';
//import './Recipe.css';
class Recipes extends Component {
    state={
        pageStart : 0,
        pageNumber: 1,
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

    render(){
        let slicedRecipes = this.props.recipes.slice(10*this.state.pageStart,10*(this.state.pageStart+5)+1)
        let renderRecipes = this.props.recipes.slice(10*(this.state.pageNumber-1),10*this.state.pageNumber)
        return (
            <div className = 'Recipes'>
                <div className = "recipes">
                        <div id='slice'>{renderRecipes && renderRecipes.slice(0,5)}</div>
                        <div id='slice'>{renderRecipes && renderRecipes.slice(5,10)}</div>
                </div>
                <div className = "pages">
                    <div className = "pagepage">
                        {slicedRecipes.length >= 1 && <div id='pagepagepage'>{'Page'}</div>}
                    </div>
                    <div className = "pagerow">
                        {this.state.pageStart != 0 && <button className="list-page-previous-button"
                                onClick={() => this.clickPagePreviousHandler()}>left</button>}
                        {slicedRecipes.length >= 1 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==1 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(1)}>{this.state.pageStart+1}</button>}
                        {slicedRecipes.length >= 11 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==2 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(2)}>{this.state.pageStart+2}</button>}
                        {slicedRecipes.length >= 21 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==3 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(3)}>{this.state.pageStart+3}</button>}
                        {slicedRecipes.length >= 31 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==4 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(4)}>{this.state.pageStart+4}</button>}
                        {slicedRecipes.length >= 41 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==0 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(5)}>{this.state.pageStart+5}</button>}
                        {slicedRecipes.length >= 51 && <button className="list-page-next-button"
                                disabled={false} onClick={() => this.clickPageNextHandler()}>right</button>}
                    </div>
                </div>
            </div>
        );
    }
}


export default Recipes
