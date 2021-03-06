import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';

import {AUTH_TOKEN} from '../../constants/constants';

class SignupPage extends Component {
    constructor() {
        super();

        this.state = {
            name: '',
            email: '',
            password: '',
            confPassword: '',
            errorPassword: false
        };
    }

    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xs-10 col-sm-8 col-md-6">
                        <div className="card login-card">
                            <h5 className="card-header">Login</h5>

                            <div className="card-body">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={this.state.name}
                                        onChange={e => this.setState({name: e.target.value})}
                                        required />
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={this.state.email}
                                        onChange={e => this.setState({email: e.target.value})}
                                        required />
                                </div>

                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${this.state.errorPassword ? 'is-invalid' : ''}`}
                                        value={this.state.password}
                                        onChange={e => this.setState({password: e.target.value})}
                                        required />
                                </div>

                                <div className="form-group">
                                    <label>Confirm Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${this.state.errorPassword ? 'is-invalid' : ''}`}
                                        value={this.state.confPassword}
                                        onChange={e => this.setState({confPassword: e.target.value})}
                                        required />
                                </div>

                                <div className="form-group">
                                    <button className="btn btn-primary" onClick={this._signup.bind(this)}>Signup</button>
                                </div>

                                <Link to="/">I have account</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    async _signup() {
        const {name, email, password, confPassword} = this.state;

        if (password.trim().length === 0 || password !== confPassword) {
            this.setState({errorPassword: true});
        } else {
            const result = await this.props.signupMutation({
                variables: {name, email, password},
            });

            const {token} = result.data.signup;
            this._saveUserData(token);

            this.props.history.push(`/`);
        }
    }

    _saveUserData(token) {
        localStorage.setItem(AUTH_TOKEN, token);
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