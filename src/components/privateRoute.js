import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';

import {AUTH_TOKEN} from '../constants/constants';
class PrivateRoute extends Component {
    render() {
        const token = localStorage.getItem(AUTH_TOKEN);

        if (!token) {
            return (<Redirect to={{
                pathname: "/login", state: {from: this.props.location}
            }} />);
        } else {
            return (<Route {...this.props} />);
        }
    }
}

export default PrivateRoute;