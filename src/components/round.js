import React, {Component} from 'react';
import _ from 'lodash';

import Select from './select';

class Round extends Component {
    constructor() {
        super();

        this.state = {
            selectedCountries: []
        };
    }

    componentWillMount() {
        let selectedCountries = _.times(this.props.maximunSelection, _.constant(''));

        if (!!this.props.previousSelection && this.props.previousSelection.length > 0) {
            this.props.previousSelection.forEach((id, index) => {
                selectedCountries[index] = id;
            });
        }

        this.setState({selectedCountries});
    }

    render() {
        let selectedCountries = this.state.selectedCountries;

        return (
            <div className="round">
                <div className="round__title">
                    {this.props.title}
                </div>

                <div className="round__body form form-inline">
                    {
                        selectedCountries.map((id, index) => (
                            <div className="form-group align-items-center" key={index}>
                                <label>{index + 1}.</label>

                                <Select
                                    index={index}
                                    value={id}
                                    onChange={this._handleChangeCountry.bind(this)}
                                    options={this.props.options}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }

    _handleChangeCountry(index, countryId) {
        let selectedCountries = this.state.selectedCountries;

        selectedCountries[index] = countryId;

        this.setState({selectedCountries});

        this.props.handleChangeCountry(selectedCountries);
    }
};

export default Round;