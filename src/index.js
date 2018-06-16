import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';
import {ApolloProvider} from 'react-apollo';
import ApolloClient from 'apollo-boost';
import {ApolloLink} from 'apollo-client-preset';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

import {AUTH_TOKEN} from './constants/constants';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/flag-icon-css/css/flag-icon.min.css';

import './index.css';

import loginPage from './pages/loginPage';
import signupPage from './pages/signupPage';

const httpLink = new HttpLink({uri: `http://localhost:4000`});

const middlewareAuthLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem(AUTH_TOKEN);
    const authorizationHeader = token ? `Bearer ${token}` : null;
    operation.setContext({
        headers: {
            authorization: authorizationHeader
        }
    });

    return forward(operation);
})

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink);

const client = new ApolloClient({
    link: httpLinkWithAuthToken,
    cache: new InMemoryCache()
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <Router>
            <Fragment>
                <Switch>
                    <Route exact path="/" component={loginPage} />
                    <Route exact path="/signup" component={signupPage} />
                </Switch>
            </Fragment>
        </Router>
    </ApolloProvider>,
    document.getElementById('root'),
)
