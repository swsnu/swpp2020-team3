import React, {Component} from 'react';
import Recipe from '../../components/Recipe/Recipe';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actionCreators from '../../store/actions/index';
import queryString from 'query-string';
import './RecipeList.css'
import PropTypes from "prop-types";
//TODO:
//      중간 이후에 할 일 : like/unlike recipe User model, authentication?
//      query string doesn't work...
class RecipeList extends Component{

    state = {
        category1: true,
        category2: true,
        category3: true,
        category4: true,
        category5: true,
        category6: true,

        minPrice : 0,
        maxPrice : 100000,
        minDuration : 0,
        maxDuration : 100,
        searchWord : "",

        pageStart : 0,
        pageNumber: 1,
        searchMode : "likes",
        searchOptionsClicked : false,
    }

    
    componentDidMount() {
        const {search} = this.props.location;
        let query = this.state;
        if(search){
            query = queryString.parse(search);
            query.category1 = query.category1 == 'true';
            query.category2 = query.category2 == 'true';
            query.category3 = query.category3 == 'true';
            query.category4 = query.category4 == 'true';
            query.category5 = query.category5 == 'true';
            query.category6 = query.category6 == 'true';
            query.pageStart = Number(query.pageStart);
            query.pageNumber = Number(query.pageNumber);
            this.setState(query);
        }
        this.props.onGetRecipes(query);
    }
    
    clickSearchModeHandler = searchmode => {
        this.setState({searchMode: searchmode});
        this.setState({searchOptionsClicked: false});
    }

    clickCategoryHandler = (event,id) => {
        if(id == 1) this.setState({category1 : !this.state.category1});
        else if(id == 2) this.setState({category2 : !this.state.category2});
        else if(id == 3) this.setState({category3 : !this.state.category3});
        else if(id == 4) this.setState({category4 : !this.state.category4});
        else if(id == 5) this.setState({category5 : !this.state.category5});
        else this.setState({category6 : !this.state.category6});
    }

    checkInputHandler = (state) =>{
        let st=state;
        if(this.state.maxPrice == '') st.maxPrice=100000;
        if(this.state.minPrice == '') st.minPrice=0;
        if(this.state.maxDuration == '') st.maxDuration=100;
        if(this.state.minDuration == '') st.minDuration=0;
        return st;
    }

    clickOptionsHandler = () => {
        this.setState({searchOptionsClicked: !(this.state.searchOptionsClicked)});
    }

    clickRecipeHandler = id => {
        this.props.history.push('/detail-page/'+id);
    }

    getURL(st){
        return `/search?category1=${st.category1}&category2=${st.category2}&category3=${st.category3}&category4=${st.category4}&category5=${st.category5}&category6=${st.category6}&minPrice=${st.minPrice}&maxPrice=${st.maxPrice}&minDuration=${st.minDuration}&maxDuration=${st.maxDuration}&searchWord=${st.searchWord}&pageStart=${st.pageStart}&pageNumber=${st.pageNumber}&searchMode=${st.searchMode}&searchOptionsClicked=${st.searchOptionsClicked}`;
    }

    clickSearchHandler = () => {
        let newState=this.checkInputHandler(this.state);
        this.props.history.push(this.getURL(newState));
        this.props.onGetRecipes(this.state);
    }

    clickPagePreviousHandler = () => {
        let newState={...this.state, pageStart: this.state.pageStart-5, pageNumber: this.state.pageStart-4};
        this.setState(newState)
        this.props.history.push(this.getURL(newState));
        this.props.onGetRecipes(newState);
    }

    clickPageNumberHandler = (id) => {
        let newState={...this.state, pageNumber: this.state.pageStart+id};
        this.setState(newState)
        this.props.history.push(this.getURL(newState));
        this.props.onGetRecipes(newState);
    }

    clickPageNextHandler = () => {
        let newState={...this.state, pageStart: this.state.pageStart+5, pageNumber: this.state.pageStart+6};
        this.setState(newState);
        this.props.history.push(this.getURL(newState));
        this.props.onGetRecipes(newState);
    }


    render(){
        let slicedRecipes;
        if(this.state.pageNumber%5 === 0)
            slicedRecipes = this.props.storedRecipes.slice(10*(this.state.pageNumber%5-1), 10*5);
        else
            slicedRecipes = this.props.storedRecipes.slice(10*(this.state.pageNumber%5-1), 10*(this.state.pageNumber%5));
        const recipes = slicedRecipes.map((recipe) => {
            return (
                <Recipe key={recipe.id}
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
                    <div id ='categoryblock'>
                        <div className = "categories">
                            <label id='option_label'>카테고리</label>
                            <div className = "row">
                                <button className="category-select-button" style = {{backgroundColor: this.state.category1 ? "#fcc051" : null}}
                                    onClick={(event) => this.clickCategoryHandler(event,1)}>양식</button>
                                <button className="category-select-button" style = {{backgroundColor: this.state.category2 ? "#fcc051" : null}}
                                    onClick={(event) => this.clickCategoryHandler(event,2)}>한식</button>
                                <button className="category-select-button" style = {{backgroundColor: this.state.category3 ? "#fcc051" : null}}
                                    onClick={(event) => this.clickCategoryHandler(event,3)}>중식</button>
                            </div>
                            <div className = "row">
                                <button className="category-select-button" style = {{backgroundColor: this.state.category4 ? "#fcc051" : null}}
                                    onClick={(event) => this.clickCategoryHandler(event,4)}>일식</button>
                                <button className="category-select-button" style = {{backgroundColor: this.state.category5 ? "#fcc051" : null}}
                                onClick={(event) => this.clickCategoryHandler(event,5)}>편의점</button>
                                <button className="category-select-button" style = {{backgroundColor: this.state.category6 ? "#fcc051" : null}}
                                onClick={(event) => this.clickCategoryHandler(event,6)}>디저트</button>
                            </div>
                        </div>
                        <div className = "constraints">
                            <div className = "cost">
                                <p id='option_label'>가격(원)</p>
                                <input className = "min-cost-input" id='list-input' placeholder = "하한" value = {this.state.minPrice} 
                                    onChange={(event) => this.setState({minPrice: event.target.value})}></input>
                                <input className = "max-cost-input" id='list-input' placeholder = "상한" value = {this.state.maxPrice} 
                                    onChange={(event) => this.setState({maxPrice: event.target.value})}></input>
                            </div>
                            <div className = "time">
                                <p id='option_label'>시간(분)</p>
                                <input className = "min-time-input" id='list-input' placeholder = "하한" value = {this.state.minDuration} 
                                    onChange={(event) => this.setState({minDuration: event.target.value})}></input>
                                <input className = "max-time-input" id='list-input' placeholder = "상한" value = {this.state.maxDuration} 
                                    onChange={(event) => this.setState({maxDuration: event.target.value})}></input>
                            </div>
                            <div className = "keywords">
                                <p id='option_label'>검색어</p>
                                <input className = "search-word-input" id='list-input' placeholder = "키워드" value = {this.state.searchWord} 
                                    onChange={(event) => this.setState({searchWord: event.target.value})}></input>
                            </div>
                        </div>
                        <div className = "search-options" id = "list-option">
                                <div className = "options">
                                    <button className ="search-options-button" onClick={() => this.clickOptionsHandler()}>분류</button>
                                    {this.state.searchOptionsClicked && <button className ="search-mode-select-button"
                                            onClick={() => this.clickSearchModeHandler("recommended")}>추천</button>}
                                    {this.state.searchOptionsClicked && <button className ="search-mode-select-button"
                                            onClick={() => this.clickSearchModeHandler("likes")}>좋아요순</button>}
                                    {this.state.searchOptionsClicked && <button className ="search-mode-select-button"
                                            onClick={() => this.clickSearchModeHandler("rating")}>평점순</button>}
                                    {this.state.searchOptionsClicked && <button className ="search-mode-select-button"
                                            onClick={() => this.clickSearchModeHandler("cost")}>비용순</button>}
                                </div>
                        </div>
                    </div>
                </div>
                <div className = "search">
                    <button className = "search-confirm-button" onClick={() => this.clickSearchHandler()}>검색</button>
                </div>
                <div className = "recipes">
                        <div id ='slice'>{recipes && recipes.slice(0,5)}</div>
                        <div id='slice'>{recipes && recipes.slice(5,14)}</div>
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
                                onClick={() => this.clickPageNumberHandler(1)}>{this.state.pageStart+1}</button>}
                        {this.props.storedRecipes.length >= 11 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==2 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(2)}>{this.state.pageStart+2}</button>}
                        {this.props.storedRecipes.length >= 21 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==3 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(3)}>{this.state.pageStart+3}</button>}
                        {this.props.storedRecipes.length >= 31 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==4 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(4)}>{this.state.pageStart+4}</button>}
                        {this.props.storedRecipes.length >= 41 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==0 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(5)}>{this.state.pageStart+5}</button>}
                        {this.props.storedRecipes.length >= 51 && <button className="list-page-next-button"
                                disabled={false} onClick={() => this.clickPageNextHandler()}>right</button>}
                    </div>
                </div>
            </div>

        )        
    }
}


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

RecipeList.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    storedRecipes: PropTypes.array,
    onGetRecipes: PropTypes.func,
};

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(RecipeList));

