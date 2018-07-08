import 'babel-polyfill';

import React, {Fragment} from 'react';
import {hot} from 'react-hot-loader';

import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import {ApolloProvider} from 'react-apollo';
import ApolloClient from 'apollo-boost';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {setContext} from 'apollo-link-context';

import {AUTH_TOKEN} from './constants/constants';

import './scss/styles.scss';

// PAGES
import loginPage from './pages/public/login';
import signupPage from './pages/public/signup';
import mainPage from './pages/private/main';

// COMPONENTS
import PrivateRoute from './components/privateRoute';

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

const App = () => (<ApolloProvider client={client}>
    <Router>
        <Fragment>
            <Switch>
                <Route exact path="/login" component={loginPage} />
                <Route exact path="/signup" component={signupPage} />
                <PrivateRoute exact path="/" component={mainPage} />
            </Switch>
        </Fragment>
    </Router>
</ApolloProvider>);

export default hot(module)(App);
