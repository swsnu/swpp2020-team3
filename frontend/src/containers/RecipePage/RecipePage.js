import React, {Component} from 'react';
import Recipe from '../../components/Recipe/Recipe';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actionCreators from '../../store/actions/index';
import queryString from 'query-string';
import './RecipePage.css'
import PropTypes from "prop-types";
//TODO:
//      중간 이후에 할 일 : like/unlike recipe User model, authentication?
//      query string doesn't work...
class RecipePage extends Component{

    state = {
        pageStart : 0,
        pageNumber: 1,
        searchMode : "likes",
        searchOptionsClicked : false,
    }

    /*
    componentDidMount() {
        const {search} = this.props.location;
        let query = this.state;
        if(search){
            query = queryString.parse(search);
            query.pageStart = Number(query.pageStart);
            query.pageNumber = Number(query.pageNumber);
            this.setState(query);
        }
        this.props.onGetRecipes(query);
    }
    */
    
    clickSearchModeHandler = searchmode => {
        this.setState({searchMode: searchmode});
        this.setState({searchOptionsClicked: false});
    }

    clickOptionsHandler = () => {
        this.setState({searchOptionsClicked: !(this.state.searchOptionsClicked)});
    }

    /*
    clickRecipeHandler = id => {
        this.props.history.push('/detail-page/'+id);
    }
    */
    /*
    getURL(st){
        return `/search?category1=${st.category1}&category2=${st.category2}&category3=${st.category3}&category4=${st.category4}&category5=${st.category5}&category6=${st.category6}&minPrice=${st.minPrice}&maxPrice=${st.maxPrice}&minDuration=${st.minDuration}&maxDuration=${st.maxDuration}&searchWord=${st.searchWord}&pageStart=${st.pageStart}&pageNumber=${st.pageNumber}&searchMode=${st.searchMode}&searchOptionsClicked=${st.searchOptionsClicked}`;
    }
    */
    clickPagePreviousHandler = () => {
        this.setState({pageStart: this.state.pageStart-5});
        this.setState({pageNumber: this.state.pageStart-4});
        /*
        let newState={...this.state, pageStart: this.state.pageStart-5, pageNumber: this.state.pageStart-4};
        this.setState(newState)
        this.props.history.push(this.getURL(newState));
        this.props.onGetRecipes(newState);
        */
    }

    clickPageNumberHandler = (id) => {
        this.setState({pageNumber: this.state.pageStart+id});
        /*
        let newState={...this.state, pageNumber: this.state.pageStart+id};
        this.setState(newState)
        this.props.history.push(this.getURL(newState));
        this.props.onGetRecipes(newState);
        */
    }

    clickPageNextHandler = () => {
        this.setState({pageStart: this.state.pageStart+5});
        this.setState({pageNumber: this.state.pageStart+6});
        /*
        let newState={...this.state, pageStart: this.state.pageStart+5, pageNumber: this.state.pageStart+6};
        this.setState(newState);
        this.props.history.push(this.getURL(newState));
        this.props.onGetRecipes(newState);
        */
    }


    render(){
        recipes = this.props.recipes.slice(10*(this.state.pageNumber-1), 10*(this.state.pageNumber));

        return(
            <div className = "RecipePage">
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
                <div className = "recipes">
                        <div id='slice'>{recipes && recipes.slice(0,5)}</div>
                        <div id='slice'>{recipes && recipes.slice(5,10)}</div>
                </div>
                <div className = "pages">
                    <div className = "page">
                        <p>Page</p>
                    </div>
                    <div className = "row">
                        {this.props.recipes.length >= 50*(this.state.pageStart)+1 && <button className="list-page-previous-button"
                                disabled ={this.state.pageStart == 0} onClick={() => this.clickPagePreviousHandler()}>left</button>}
                        {this.props.recipes.length >= 50*(this.state.pageStart)+1 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==1 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(1)}>{this.state.pageStart+1}</button>}
                        {this.props.recipes.length >= 50*(this.state.pageStart)+11 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==2 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(2)}>{this.state.pageStart+2}</button>}
                        {this.props.recipes.length >= 50*(this.state.pageStart)+21 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==3 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(3)}>{this.state.pageStart+3}</button>}
                        {this.props.recipes.length >= 50*(this.state.pageStart)+31 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==4 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(4)}>{this.state.pageStart+4}</button>}
                        {this.props.recipes.length >= 50*(this.state.pageStart)+41 && <button className="list-page-number-button"
                                style = {{backgroundColor: this.state.pageNumber%5==0 ? "grey" : null}}
                                onClick={() => this.clickPageNumberHandler(5)}>{this.state.pageStart+5}</button>}
                        {this.props.recipes.length >= 50*(this.state.pageStart)+51 && <button className="list-page-next-button"
                                disabled={false} onClick={() => this.clickPageNextHandler()}>right</button>}
                    </div>
                </div>
            </div>

        )        
    }
}

/*
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

RecipePage.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    storedRecipes: PropTypes.array,
    onGetRecipes: PropTypes.func,
};
*/
//export default connect(mapStateToProps,mapDispatchToProps)(withRouter(RecipePage));
export default RecipePage;

