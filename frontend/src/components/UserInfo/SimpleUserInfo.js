import React from 'react';
import './SimpleUserInfo.css';
import PropTypes from "prop-types";
const SimpleUserInfo = (props) => {
    return (
        <div className='SimpleUserInfo'>
            <div id='showuser' className = 'username'>
            {'username:\u00A0\u00A0\u00A0'+props.username}
            </div>
            <div  id='showuser' className = 'email'>
            {'email:\u00A0\u00A0\u00A0'+props.email}
            </div>
        </div>
    );
};

SimpleUserInfo.propTypes = {
    username: PropTypes.string,
    email: PropTypes.string,
};

export default SimpleUserInfo;