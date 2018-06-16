import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';

import {AUTH_TOKEN} from '../constants/constants';
import './loginPage.css';

class SignupPage extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        confPassword: '',
        errorPassword: false
    }

    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xs-10 col-sm-8 col-md-6 col-lg-4">
                        <div className="card login-card">
                            <h5 className="card-header">Login</h5>
                            <div className="card-body">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={this.state.name}
                                        onChange={e => this.setState({name: e.target.value})} />
                                </div>

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

                                <div className={`form-group ${this.state.errorPassword ? 'has-error' : ''}`}>
                                    <label>Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={this.state.confPassword}
                                        onChange={e => this.setState({confPassword: e.target.value})} />
                                </div>

                                <div className="form-group">
                                    <button className="btn btn-primary" onClick={this._signup}>Signup</button>
                                </div>

                                <Link to="/">I not have account yet</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    _signup = async () => {
        const {name, email, password, confPassword} = this.state;

        if (password !== confPassword) {
            this.setState({errorPassword: true});
        } else {
            const result = await this.props.signupMutation({
                variables: {name, email, password},
            });

            console.log(result);

            const {token} = result.data.signup;
            this._saveUserData(token);

            //this.props.history.push(`/`)
        }
    }

    _saveUserData = token => {
        localStorage.setItem(AUTH_TOKEN, token)
    }
}

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

export default compose(graphql(SIGNUP_MUTATION, {name: 'signupMutation'}))(SignupPage);