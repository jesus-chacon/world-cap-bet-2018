import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';

import Loading from '../../components/loading';
import Group from '../../components/group';

class Main extends Component {
    constructor() {
        super();

        this.state = {
            groups: [[], [], [], [], [], [], [], []],
            countries: [],
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
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-xs">
                            <h1>Error loading data</h1>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h1>1. Select the countries for every group</h1>
                    </div>

                    {(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']).map((title, index) => (
                        <div className="col-xs-6 col-sm-4 col-md-3" key={index.toString()}>
                            <Group
                                title={title}
                                index={index}
                                options={this.state.countries}
                                handleChangeCountry={this._reloadAvailableCountries.bind(this)}
                            />
                        </div>
                    ))}
                </div>

                {
                    this._totalSelection() == 32 && !this._isValidSelection() &&

                    <div className="row">
                        <div className="col-12">
                            <p className="text-danger text-center">The selection is invalid</p>
                        </div>
                    </div>
                }
            </div>
        );
    }

    componentWillReceiveProps() {
        if (!!this.props.countriesQuery.countries && this.props.countriesQuery.countries.length > 0) {
            const countries = this.props.countriesQuery.countries;

            this.setState({countries: countries});
        }
    }

    _reloadAvailableCountries(index, selectedCountries) {
        let currentSelection = this.state.groups;

        currentSelection[index] = selectedCountries;

        this.setState({groups: currentSelection});
    }

    _isValidSelection() {
        let selectionList = [];

        /* Join selections */
        _.forEach(this.state.groups, group => {
            selectionList = _.concat(selectionList, group);
        });

        /* Remove empty selection */
        _.remove(selectionList, id => (!id || id.trim().length == 0));

        /* Remove duplicates */
        selectionList = _.uniq(selectionList);

        return selectionList.length == 32;
    }

    _totalSelection() {
        let selectionList = [];

        _.forEach(this.state.groups, group => {
            selectionList = _.concat(selectionList, group);
        });

        _.remove(selectionList, id => (!id || id.trim().length == 0));


        return selectionList.length;
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
