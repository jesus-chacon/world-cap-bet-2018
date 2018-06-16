import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';

import {AUTH_TOKEN} from '../constants/constants';
import './loginPage.css';

class LoginPage extends Component {
    state = {
        email: '',
        password: ''
    };

    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xs-10 col-sm-8 col-md-6 col-lg-4">
                        <div className="card login-card">
                            <h5 className="card-header">Login</h5>
                            <div className="card-body">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={this.state.email}
                                        onChange={e => this.setState({email: e.target.value})} />
                                </div>

                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={this.state.password}
                                        onChange={e => this.setState({password: e.target.value})} />
                                </div>

                                <div className="form-group">
                                    <button className="btn btn-primary" onClick={this._login} >Login</button>
                                </div>

                                <Link to="/signup">I not have account yet</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    _login = async () => {
        const {email, password} = this.state

        const result = await this.props.loginMutation({
            variables: {email, password},
        });

        console.log(result);

        const {token} = result.data.login;
        this._saveUserData(token);

        //this.props.history.push(`/app`);
    };

    _saveUserData = token => {
        localStorage.setItem(AUTH_TOKEN, token);
    }
}

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export default compose(graphql(LOGIN_MUTATION, {name: 'loginMutation'}))(LoginPage);