import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import Loading from '../../components/loading';
import Group from '../../components/group';

class Main extends Component {
    constructor() {
        super();

        this.state = {
            groups: ['', '', '', '', '', '', '', ''],
            availableOptions: [],
            countries: []
        }
    }

    render() {


        if (this.props.countriesQuery && this.props.countriesQuery.loading) {
            return (
                <div className="container">
                    <Loading loading={this.props.countriesQuery.loading} />
                </div>
            );
        }

        if (this.props.countriesQuery && this.props.countriesQuery.error) {
            return (<div className="container">
                <div className="row">
                    <div className="col-xs">
                        <h1>Error loading data</h1>
                    </div>
                </div>
            </div>);
        }

        const countries = this.props.countriesQuery.countries;

        this.setState({countries});
        this._reloadAvailableCountries(-1, []);


        return (
            <div className="container">
                <div className="row">
                    {([0, 1, 2, 3, 4, 5, 6, 7]).map(index => (
                        <Group
                            key={index}
                            index={index}
                            options={this.state.availableOptions}
                            handleChangeCountry={this._reloadAvailableCountries.bind(this)}
                        />
                    ))}
                </div>
            </div>
        );
    }

    _reloadAvailableCountries(index, selectedCountries) {
        if (index === -1) {
            this.setState({availableOptions: this.state.countries});
        } else {
            let currentSelection = this.state.groups;

            currentSelection[index] = selectedCountries;

            //TODO
        }
    }
}

const COUNTRIES_FEED = gql`
    query countriesQuery {
        countries {
            id
            name
            flag
        }
    }
`
export default graphql(COUNTRIES_FEED, {name: 'countriesQuery'})(Main);
