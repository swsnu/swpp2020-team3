import React, {Component} from 'react';
import DisplayRecipe from '../../components/Recipe/DisplayRecipe'
import './Mainpage.css';
class Mainpage extends Component{

    state = {
        dailyrandomList: [
            {image: require('../../Image/item.png'), title: 'item1'}, 
            {image: require('../../Image/item.png'), title: 'item2'}, 
            {image: require('../../Image/item.png'), title: 'item3'},
            {image: require('../../Image/item.png'), title: 'item4'}, 
        ],
        secondList : [
            {image: require('../../Image/item.png'), title: 'item1'}, 
            {image: require('../../Image/item.png'), title: 'item2'}, 
            {image: require('../../Image/item.png'), title: 'item3'},
            {image: require('../../Image/item.png'), title: 'item4'}, 
            {image: require('../../Image/item.png'), title: 'item5'}
        ],
        thirdList : [
            {image: require('../../Image/item.png'), title: 'item1'}, 
            {image: require('../../Image/item.png'), title: 'item2'}, 
            {image: require('../../Image/item.png'), title: 'item3'},
            {image: require('../../Image/item.png'), title: 'item4'}, 
            {image: require('../../Image/item.png'), title: 'item5'}
        ],
    }

    toCreateHandler() {
        this.props.history.push('/create')
        window.location.reload()
    }

    render(){
        const dailyrandomList = this.state.dailyrandomList.map( (td) => {
            return (
                <li className = 'random_content'>
                    <DisplayRecipe img = {<img src = {td.image}/>} title = {td.title} />
                </li>
            )   
        })
        const secondlist = this.state.secondList.map( (td) => {
            return (
                <li className = 'random_content'>
                    <DisplayRecipe img = {<img src = {td.image}/>} title = {td.title} />
                </li>
            )   
        })
        const thirdlist = this.state.thirdList.map( (td) => {
            return (
                <li className = 'random_content'>
                    <DisplayRecipe img = {<img src = {td.image}/>} title = {td.title} />
                </li>
            )   
        })
        return(
            <div className = 'MainpageBackground'>
                <div className = 'Mainpage'>
                    <div className = 'firstBlock'>
                        <div className = 'list_title'>{'오늘의 랜덤 레시피  &   레시피 등록하기'}</div>
                        <ul className = 'first_list'> 
                            {dailyrandomList}
                            <li className = 'toCreate'>
                                <div><img src = {require('../../Image/toCreate.png')} onClick = {() => this.toCreateHandler()}/></div>
                                <div>{'click to create'}</div>
                            </li>
                        </ul>
                    </div>
                    <div className = 'secondBlock'>
                        <div className = 'list_title'>{'최근 인기 레시피'}</div>
                        <ul className = 'second_list'>
                            {secondlist}
                        </ul>
                    </div>
                    <div className = 'thirdBlock'>
                        <div className = 'list_title'>{'내 입맛 맞춤 레시피'}</div>
                        <ul className = 'third_list'>
                        {thirdlist}
                        </ul>
                    </div>
                </div>
            </div>
        )        
    }
};

export default Mainpage;
