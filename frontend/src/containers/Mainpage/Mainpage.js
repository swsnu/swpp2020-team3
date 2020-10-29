import React, {Component} from 'react';
import './Mainpage.css';
class Mainpage extends Component{
    render(){
        return(
            <div>
                <ul className = 'first_list'> 
                    <li className = 'random_content'>
                        <p>random</p>
                        <img src = {require('../../Image/Daily_Random.png')}/>
                    </li>
                    <li className = 'random_content'>
                        <p>create</p>
                        <img src = {require('../../Image/toCreate.png')}/>
                    </li>
                </ul>
                <ul className = 'second_list'>
                    <li className = 'random_content'>
                        <p>item1</p>
                        <img src = {require('../../Image/item.png')}/>
                    </li>
                    <li className = 'random_content'>
                        <p>item2</p>
                        <img src = {require('../../Image/item.png')}/>
                    </li>
                    <li className = 'random_content'>
                        <p>item3</p>
                        <img src = {require('../../Image/item.png')}/>
                    </li>
                </ul>
                <ul className = 'third_list'>
                    <li className = 'random_content'>
                        <p>item1</p>
                        <img src = {require('../../Image/item.png')}/>
                    </li>
                    <li className = 'random_content'>
                        <p>item2</p>
                        <img src = {require('../../Image/item.png')}/>
                    </li>
                </ul>
            </div>
        )        
    }
};

export default Mainpage;
