import React, {Component} from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from "prop-types";

import * as actionCreators from '../../store/actions/index'

class Mealplanner extends Component{

    state={
        min: '',
        max: '',
        numOfDays: ''
    }

    componentDidMount() {
        // Will remove this and replace with reducer that gets ml recommendation
        let toEraseQuery;
        toEraseQuery = {
            category1: true,
            category2: true,
            category3: true,
            category4: true,
            category5: true,
            category6: true,
            minPrice: 0,
            maxPrice: 1000,
            minDuration: 0,
            maxDuration: 1000,
            pageStart: 0,
        }
        this.props.getRecipes(toEraseQuery).then((res) => console.log(res))
    }


    render(){

        return(
            <div className = 'Dayplanner'>
                
            </div>
        )        
    }
}

const mapStateToProps = state => {
    return {
        storedRecipes: state.rcp.recipes,
    }
}
  
const mapDispatchToProps = dispatch => {
    return {
        getRecipes: (searchSettings) =>
            dispatch(actionCreators.getRecipes(searchSettings)),
    }
}

Mealplanner.propTypes = {
    // onGetRandom: PropTypes.func,
    // storedRecipes: PropTypes.array,
    // history: PropTypes.object
};

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Mealplanner));
