import React, {Component} from 'react';
import Recipe from '../../components/Recipe/Recipe';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actionCreators from '../../store/actions/index';
import queryString from 'query-string';
import './RecipeList.css'
import PropTypes from "prop-types";

class RecipeList extends Component{

    state = {
        searchSettings: {
            American: true,
            Korean: true,
            Chinese: true,
            Japanese: true,
            ConvenienceStore: true,
            Dessert: true,

            minPrice : 0,
            maxPrice : 100000,
            minDuration : 0,
            maxDuration : 100,
            searchWord : "",
            searchMode : "likes",
            pageNumber: 1,
        },

        tempSearchSettings: {
            American: true,
            Korean: true,
            Chinese: true,
            Japanese: true,
            ConvenienceStore: true,
            Dessert: true,

            minPrice : 0,
            maxPrice : 100000,
            minDuration : 0,
            maxDuration : 100,
            searchWord : "",
            searchMode : "likes",
        },

        
    }
    
    componentDidMount() {
        const {search} = this.props.location;
        let query = this.state.searchSettings;
        if(search){
            query = queryString.parse(search);
            query.American = query.American == 'true';
            query.Korean = query.Korean == 'true';
            query.Chinese = query.Chinese == 'true';
            query.Japanese = query.Japanese == 'true';
            query.ConvenienceStore = query.ConvenienceStore == 'true';
            query.Dessert = query.Dessert == 'true';
            query.pageNumber = Number(query.pageNumber);
            this.setState({searchSettings: query});
            this.setState({tempSearchSettings: query});
            console.log(query);
        }
        this.props.onGetRecipes(query);
    }
    
    clickSearchModeHandler = searchmode => {
        this.setState(prevState => ({
            ...prevState,
            tempSearchSettings: {
                ...prevState.tempSearchSettings,
                searchMode: searchmode,
            }
        }));
    }

    clickCategoryHandler = (id) => {
        if(id == 1) this.setState(prevState => ({
            ...prevState,
            tempSearchSettings: {
                ...prevState.tempSearchSettings,
                American: !prevState.tempSearchSettings.American,
            }
        }));
        else if(id == 2) this.setState(prevState => ({
            ...prevState,
            tempSearchSettings: {
                ...prevState.tempSearchSettings,
                Korean: !prevState.tempSearchSettings.Korean,
            }
        }));
        else if(id == 3) this.setState(prevState => ({
            ...prevState,
            tempSearchSettings: {
                ...prevState.tempSearchSettings,
                Chinese: !prevState.tempSearchSettings.Chinese,
            }
        }));
        else if(id == 4) this.setState(prevState => ({
            ...prevState,
            tempSearchSettings: {
                ...prevState.tempSearchSettings,
                Japanese: !prevState.tempSearchSettings.Japanese,
            }
        }));
        else if(id == 5) this.setState(prevState => ({
            ...prevState,
            tempSearchSettings: {
                ...prevState.tempSearchSettings,
                ConvenienceStore: !prevState.tempSearchSettings.ConvenienceStore,
            }
        }));
        else this.setState(prevState => ({
            ...prevState,
            tempSearchSettings: {
                ...prevState.tempSearchSettings,
                Dessert: !prevState.tempSearchSettings.Dessert,
            }
        }));
    }
    parse = (string) => {
        let value = 0;
        for(let i = 0; i < string.length; i++){
            if(string[i] < '0' || string[i] > '9'){
                return NaN;
            }
            value = 10 * value + parseInt(string[i]);
        }
        return value;
    }


    checkInputHandler = (state) =>{
        let st=state;
        let tempMaxPrice, tempMinPrice;
        let tempMaxDuration, tempMinDuration;
        let message = '';
        tempMaxPrice = this.parse(st.maxPrice);
        tempMinPrice = this.parse(st.minPrice);
        tempMaxDuration = this.parse(st.maxDuration);
        tempMinDuration = this.parse(st.minDuration);
        if(isNaN(tempMaxPrice)) message += "가격의 상한을 올바르게 입력하세요.\n";
        if(isNaN(tempMinPrice)) message += "가격의 하한을 올바르게 입력하세요.\n";
        if(isNaN(tempMaxDuration)) message += "조리 시간의 상한을 올바르게 입력하세요.\n";
        if(isNaN(tempMinDuration)) message += "조리 시간의 하한을 올바르게 입력하세요.\n";

        if(message){
            window.alert(message);
            return null;
        }
        
        return st;
    }

    clickRecipeHandler = id => {
        this.props.history.push('/detail-page/'+id);
    }

    getURL(st){
        return `/search?American=${st.American}&Korean=${st.Korean}&Chinese=${st.Chinese}&Japanese=${st.Japanese}&ConvenienceStore=${st.ConvenienceStore}&Dessert=${st.Dessert}&minPrice=${st.minPrice}&maxPrice=${st.maxPrice}&minDuration=${st.minDuration}&maxDuration=${st.maxDuration}&searchWord=${st.searchWord}&pageNumber=${st.pageNumber}&searchMode=${st.searchMode}`;
    }


    clickSearchHandler = () => {
        let newSearchSettings=this.checkInputHandler({...this.state.tempSearchSettings, pageNumber: 1});
        if(newSearchSettings){
            this.setState(prevState => ({
                ...prevState,
                SearchSettings: newSearchSettings,
            }));
            this.props.history.push(this.getURL(newSearchSettings));
            this.props.onGetRecipes(newSearchSettings);
            window.location.reload();
        }   
    }

    clickPagePreviousHandler = () => {
        let newPageNumber = 5*Math.floor((this.state.searchSettings.pageNumber-1)/5)-4;
        let newSearchSettings={...this.state.searchSettings,  pageNumber: newPageNumber};
        this.setState(prevState => ({
            ...prevState,
            searchSettings: newSearchSettings,
        }));
        this.props.history.push(this.getURL(newSearchSettings));
        this.props.onGetRecipes(newSearchSettings);
        window.location.reload();
    }

    clickPageNumberHandler = (id) => {
        let newPageNumber = 5*Math.floor((this.state.searchSettings.pageNumber-1)/5)+id;
        let newSearchSettings={...this.state.searchSettings,  pageNumber: newPageNumber};
        this.setState(prevState => ({
            ...prevState,
            searchSettings: newSearchSettings,
        }));
        this.props.history.push(this.getURL(newSearchSettings));
    }

    clickPageNextHandler = () => {
        let newPageNumber = 5*Math.floor((this.state.searchSettings.pageNumber-1)/5)+6;
        let newSearchSettings={...this.state.searchSettings,  pageNumber: newPageNumber};
        this.setState(prevState => ({
            ...prevState,
            searchSettings: newSearchSettings,
        }));
        this.props.history.push(this.getURL(newSearchSettings));
        this.props.onGetRecipes(newSearchSettings);
        window.location.reload();
    }

    updateHandler = (event) => {
        console.log(event);
        this.setState(prevState => ({
            ...prevState,
            tempSearchSettings: {
                ...prevState.tempSearchSettings,
                minPrice: event.target.value,
            }
        }));
    }


    render(){
        let slicedRecipes, pageStart;
        let quotient = Math.floor((this.state.searchSettings.pageNumber-1)/5);
        let remainder = (this.state.searchSettings.pageNumber-1)%5;
        pageStart = 5*Math.floor(quotient/5);
        slicedRecipes = this.props.storedRecipes.slice(remainder*10,(remainder+1)*10)

        const recipes = slicedRecipes.map((recipe) => {
            return (
                <Recipe key={recipe.id}
                    author={recipe.author}
                    thumbnail={recipe.thumbnail}
                    title={recipe.title}
                    rating={recipe.rating}
                    cost={recipe.price}
                    likes={recipe.likes}
                    clickedRecipe={() => this.clickRecipeHandler(recipe.id)}
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
                                <button className="category-select-button" style = {{backgroundColor: this.state.tempSearchSettings.American ? "#fcc051" : null}}
                                    onClick={() => this.clickCategoryHandler(1)}>양식</button>
                                <button className="category-select-button" style = {{backgroundColor: this.state.tempSearchSettings.Korean ? "#fcc051" : null}}
                                    onClick={() => this.clickCategoryHandler(2)}>한식</button>
                                <button className="category-select-button" style = {{backgroundColor: this.state.tempSearchSettings.Chinese ? "#fcc051" : null}}
                                    onClick={() => this.clickCategoryHandler(3)}>중식</button>
                            </div>
                            <div className = "row">
                                <button className="category-select-button" style = {{backgroundColor: this.state.tempSearchSettings.Japanese ? "#fcc051" : null}}
                                    onClick={() => this.clickCategoryHandler(4)}>일식</button>
                                <button className="category-select-button" style = {{backgroundColor: this.state.tempSearchSettings.ConvenienceStore ? "#fcc051" : null}}
                                onClick={() => this.clickCategoryHandler(5)}>편의점</button>
                                <button className="category-select-button" style = {{backgroundColor: this.state.tempSearchSettings.Dessert ? "#fcc051" : null}}
                                onClick={() => this.clickCategoryHandler(6)}>디저트</button>
                            </div>
                        </div>
                        <div className = "constraints">
                            <div className = "cost">
                                <p id='option_label'>가격(원)</p>
                                <input className = "min-cost-input" id='list-input' placeholder = "하한" value = {this.state.tempSearchSettings.minPrice}
                                    onChange={(event) => this.setState({...this.state, tempSearchSettings:{...this.state.tempSearchSettings, minPrice:event.target.value}})}></input>
                                <input className = "max-cost-input" id='list-input' placeholder = "상한" value = {this.state.tempSearchSettings.maxPrice}
                                     onChange={(event) => this.setState({...this.state, tempSearchSettings:{...this.state.tempSearchSettings, maxPrice:event.target.value}})}></input>
                            </div>
                            <div className = "time">
                                <p id='option_label'>시간(분)</p>
                                <input className = "min-time-input" id='list-input' placeholder = "하한" value = {this.state.tempSearchSettings.minDuration}
                                    onChange={(event) => this.setState({...this.state, tempSearchSettings:{...this.state.tempSearchSettings, minDuration:event.target.value}})}></input>
                                <input className = "max-time-input" id='list-input' placeholder = "상한" value = {this.state.tempSearchSettings.maxDuration}
                                    onChange={(event) => this.setState({...this.state, tempSearchSettings:{...this.state.tempSearchSettings, maxDuration:event.target.value}})}></input>
                            </div>
                            <div className = "keywords">
                                <p id='option_label'>검색어</p>
                                <input className = "search-word-input" id='list-input' placeholder = "키워드" value = {this.state.tempSearchSettings.searchWord} 
                                     onChange={(event) => this.setState({...this.state, tempSearchSettings:{...this.state.tempSearchSettings, searchWord:event.target.value}})}></input>
                            </div>
                        </div>
                        <div className = "search-options" id = "list-option">
                                <div className = "options">
                                    <div className ="search-options-button">분류</div>
                                    <button className ="search-mode-select-button" style = {{backgroundColor: this.state.tempSearchSettings.searchMode == 'likes' ? "#fcc051" : null}}
                                            onClick={() => this.clickSearchModeHandler("likes")}>좋아요순</button>
                                    <button className ="search-mode-select-button" style = {{backgroundColor: this.state.tempSearchSettings.searchMode == 'rating' ? "#fcc051" : null}}
                                            onClick={() => this.clickSearchModeHandler("rating")}>평점순</button>
                                    <button className ="search-mode-select-button" style = {{backgroundColor: this.state.tempSearchSettings.searchMode == 'cost' ? "#fcc051" : null}}
                                            onClick={() => this.clickSearchModeHandler("cost")}>비용순</button>
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
                        {this.props.storedRecipes.length >= 1 && <p>Page</p>}
                    </div>
                    <div className = "row">
                        {Math.floor((this.state.searchSettings.pageNumber-1)/5)!=0 && this.props.storedRecipes.length >= 1 && <button className="list-page-previous-button"
                                onClick={() => this.clickPagePreviousHandler()}>left</button>}
                        {this.props.storedRecipes.length >= 1 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.searchSettings.pageNumber%5==1 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(1)}>{5*Math.floor((this.state.searchSettings.pageNumber-1)/5)+1}</button>}
                        {this.props.storedRecipes.length >= 11 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.searchSettings.pageNumber%5==2 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(2)}>{5*Math.floor((this.state.searchSettings.pageNumber-1)/5)+2}</button>}
                        {this.props.storedRecipes.length >= 21 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.searchSettings.pageNumber%5==3 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(3)}>{5*Math.floor((this.state.searchSettings.pageNumber-1)/5)+3}</button>}
                        {this.props.storedRecipes.length >= 31 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.searchSettings.pageNumber%5==4 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(4)}>{5*Math.floor((this.state.searchSettings.pageNumber-1)/5)+4}</button>}
                        {this.props.storedRecipes.length >= 41 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.searchSettings.pageNumber%5==0 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(5)}>{5*Math.floor((this.state.searchSettings.pageNumber-1)/5)+5}</button>}
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

