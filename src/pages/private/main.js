import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';

import Loading from '../../components/loading';
import Group from '../../components/group';
import Round from '../../components/round';

class Main extends Component {
    constructor() {
        super();

        this.state = {
            groups: [[], [], [], [], [], [], [], []],
            round8: [],
            round4: [],
            round2: [],
            final: [],
            winner: [],
            third: []
        };
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

        const countries = this.props.countriesQuery.countries;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h2>1. Select the countries for every group</h2>
                    </div>

                    {(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']).map((title, index) => (
                        <div className="col-xs-6 col-sm-4 col-md-3" key={index.toString()}>
                            <Group
                                title={title}
                                index={index}
                                options={countries}
                                previousSelection={this.state.groups[index]}
                                handleChangeCountry={(selectedCountries) => {
                                    this._reloadSelectedCountriesForGroups.bind(this)(index, selectedCountries);
                                }}
                            />
                        </div>
                    ))}
                </div>

                {
                    this._totalGroupSelection() == 32 && !this._isValidGroupSelection() &&

                    <div className="row">
                        <div className="col-12">
                            <p className="text-danger text-center">The selection is invalid</p>
                        </div>
                    </div>
                }

                {
                    this._isValidGroupSelection() &&

                    <div className="row">
                        <div className="col-12">
                            <h2>2. Select the 8th round</h2>
                        </div>

                        <div className="col-12">
                            <Round
                                maximunSelection={16}
                                previousSelection={this.state.round8}
                                options={this._getRound8AvailableCountries.bind(this)()}
                                handleChangeCountry={((selectedCountries) => {
                                    this._reloadSelectedCountriesForRound.bind(this)('round8', selectedCountries);
                                }).bind(this)}
                            />
                        </div>
                    </div>
                }

                {
                    this._isValidGroupSelection() && this._isValidSelection(this.state.round8, 16) &&

                    <div className="row">
                        <div className="col-12">
                            <h2>3. Select the 4th round</h2>
                        </div>

                        <div className="col-12">
                            <Round
                                maximunSelection={8}
                                previousSelection={this.state.round4}
                                options={this._getRoundAvailableCountries.bind(this)(this.state.round8)}
                                handleChangeCountry={((selectedCountries) => {
                                    this._reloadSelectedCountriesForRound.bind(this)('round4', selectedCountries);
                                }).bind(this)}
                            />
                        </div>
                    </div>
                }

                {
                    this._isValidGroupSelection() && this._isValidSelection(this.state.round4, 8) &&

                    <div className="row">
                        <div className="col-12">
                            <h2>4. Select the 2th round</h2>
                        </div>

                        <div className="col-12">
                            <Round
                                maximunSelection={4}
                                previousSelection={this.state.round2}
                                options={this._getRoundAvailableCountries.bind(this)(this.state.round4)}
                                handleChangeCountry={((selectedCountries) => {
                                    this._reloadSelectedCountriesForRound.bind(this)('round2', selectedCountries);
                                }).bind(this)}
                            />
                        </div>
                    </div>
                }

                {
                    this._isValidGroupSelection() && this._isValidSelection(this.state.round2, 4) &&

                    <div className="row">
                        <div className="col-12">
                            <h2>5. Select the final round</h2>
                        </div>

                        <div className="col-12">
                            <Round
                                maximunSelection={2}
                                previousSelection={this.state.final}
                                options={this._getRoundAvailableCountries.bind(this)(this.state.round2)}
                                handleChangeCountry={((selectedCountries) => {
                                    this._reloadSelectedCountriesForRound.bind(this)('final', selectedCountries);
                                }).bind(this)}
                            />
                        </div>
                    </div>
                }

                {
                    this._isValidGroupSelection() && this._isValidSelection(this.state.final, 2) &&

                    <div className="row">
                        <div className="col-12">
                            <h2>6. Select the winner</h2>
                        </div>

                        <div className="col-12">
                            <Round
                                maximunSelection={1}
                                title="Winner"
                                previousSelection={this.state.final}
                                options={this._getRoundAvailableCountries.bind(this)(this.state.final)}
                                handleChangeCountry={((selectedCountries) => {
                                    this._reloadSelectedCountriesForRound.bind(this)('winner', selectedCountries);
                                }).bind(this)}
                            />
                        </div>
                    </div>
                }

                {
                    this._isValidGroupSelection() && this._isValidSelection(this.state.winner, 1) &&

                    <div className="row">
                        <div className="col-12">
                            <h2>7. Select the third</h2>
                        </div>

                        <div className="col-12">
                            <Round
                                maximunSelection={1}
                                title="thind"
                                previousSelection={this.state.third}
                                options={_.difference(this._getRoundAvailableCountries.bind(this)(this.state.round2), this.state.final)}
                                handleChangeCountry={((selectedCountries) => {
                                    this._reloadSelectedCountriesForRound.bind(this)('third', selectedCountries);
                                }).bind(this)}
                            />
                        </div>
                    </div>
                }
                <button type="button" className="btn btn-primary" onClick={this._save.bind(this)}>Save Bet</button>
            </div>
        );
    }

    _reloadAvailableCountries(index, selectedCountries) {
        let currentSelection = this.state.groups;

        currentSelection[index] = selectedCountries;

        this.setState({groups: currentSelection});
    }

    _isValidSelection(countries, total) {
        let countriesCopy = [...countries];
        /* Remove empty selection */
        _.remove(countriesCopy, id => (!id || id.trim().length == 0));

        /* Remove duplicates */
        countriesCopy = _.uniq(countriesCopy);

        return countriesCopy.length == total;
    }

    _isValidGroupSelection() {
        let selectionList = [];

        /* Join selections */
        _.forEach(this.state.groups, group => {
            selectionList = _.concat(selectionList, group);
        });

        return this._isValidSelection(selectionList, 32);
    }

    _totalGroupSelection() {
        let selectionList = [];

        _.forEach(this.state.groups, group => {
            selectionList = _.concat(selectionList, group);
        });

        _.remove(selectionList, id => (!id || id.trim().length == 0));

        return selectionList.length;
    }

    _getRound8AvailableCountries() {
        let availableCountries = [];

        for (let i = 0; i < this.state.groups.length; i++) {
            for (let j = 0; j < 2; j++) {
                availableCountries.push(this.state.groups[i][j]);
            }
        }

        return this._getRoundAvailableCountries(availableCountries);
    }

    _getRoundAvailableCountries(previousSelection) {
        return _.map(previousSelection, countryId => _.find(this.props.countriesQuery.countries, ({id}) => id === countryId));
    }

    _reloadSelectedCountriesForGroups(index, selectedCountries) {
        let currentsGroups = this.state.groups;

        currentsGroups[index] = selectedCountries;

        this.setState({groups: currentsGroups});
    }

    _reloadSelectedCountriesForRound(roundProp, selectedCountries) {
        let updateState = {};

        updateState[roundProp] = selectedCountries;

        this.setState(updateState);
    }

    _save() {
        console.log('Holis');
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
