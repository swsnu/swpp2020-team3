import React, {Component} from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import Dropdown from 'react-dropdown';
import PropTypes from "prop-types";

// Local imports
import * as actionCreators from '../../store/actions/index'
import 'react-dropdown/style.css';


class Ingredient extends Component{
    state = {
        data: '',
        name: '',
        quantity: 0,
        price: 0,
        price_normalized: 0,
        igd_type: '',
        brand: '',
        picture: '',
        ingr: ''
    }
    componentDidMount(){
        console.log("hello")
        this.props.onGetIgrList()
        this.setState({data: this.props.igrdList})
        this.setState({name: this.state.data['name']})
        this.setState({quantity: this.state.data['quantity']})
        this.setState({price: this.state.data['price']})
        this.setState({price_normalized: this.state.data['price_normalized']})
        this.setState({igd_type: this.state.data['igd_type']})
        this.setState({brand: this.state.data['brand']})
        this.setState({picture: this.state.data['picture']})
    }
    
    _onSelect(event){
        this.setState({ingr: event['label']})
        //console.log()

    }

    render(){
        let options ;
        // console.log(this.props.igrdList[0])
         let igrdList = this.props.igrdList[0]
        // if(igrdList){
        //     options = [
                
        //     ]
        // }
         
        if(igrdList){
        options = [
            { value: 'one', label: igrdList['name'], icon: require('./temp.png') },
            { value: 'two', label: 'Two', className: 'myOptionClassName' },
            {
            type: 'group', name: 'group1', items: [
            { value: 'three', label: 'Three', className: 'myOptionClassName' },
            { value: 'four', label: 'Four' }
            ]
            },
            {
            type: 'group', name: 'group2', items: [
            { value: 'five', label: 'Five' },
            { value: 'six', label: 'Six' }
            ]
            }
        ];
    }   
        return(
            <div className="ingredient">
                <Dropdown options={options} onChange={(event)=>this._onSelect(event)} 
                 placeholder="Select an option" />
                {this.state.ingr}

            </div>     
        )
    }
}

const mapStateToProps = state => {
    return {
       igrdList: state.rcp.ingredientList
    };
}
  
const mapDispatchToProps = dispatch => {
    return {
        onGetIgrList: () => dispatch(actionCreators.getIngredients())
        }
    }

Ingredient.propTypes = {
    igrdList: PropTypes.array,
    onGetIgrList: PropTypes.func
};

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Ingredient));

