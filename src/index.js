import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';
import {ApolloProvider} from 'react-apollo';
import ApolloClient from 'apollo-boost';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {setContext} from 'apollo-link-context';

import {AUTH_TOKEN} from './constants/constants';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/flag-icon-css/css/flag-icon.min.css';

import './index.css';

// PAGES
import loginPage from './pages/loginPage';
import signupPage from './pages/signupPage';


const authLink = setContext((_, {headers}) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem(AUTH_TOKEN);
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    link: authLink,
    cache: new InMemoryCache(),
    uri: 'http://localhost:4000'
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <Router>
            <Fragment>
                <Switch>
                    <Route exact path="/login" component={loginPage} />
                    <Route exact path="/signup" component={signupPage} />
                </Switch>
            </Fragment>
        </Router>
    </ApolloProvider>,
    document.getElementById('root'),
);
