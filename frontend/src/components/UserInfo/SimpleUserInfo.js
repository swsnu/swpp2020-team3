import React from 'react';
//import './UserInfo.css';
import PropTypes from "prop-types";
const SimpleUserInfo = (props) => {
    return (
        <div className='SimpleUserInfo'>
            <div className = 'username'>
            {props.username}
            </div>
            <div className = 'first_name'>
            {props.first_name}
            </div>
            <div className = 'last_name'>
            {props.last_name}
            </div>
            <div className = 'email'>
            {props.email}
            </div>
        </div>
    );
};

SimpleUserInfo.propTypes = {
    username: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
};

export default SimpleUserInfo;