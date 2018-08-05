import React, {Component} from 'react';

import Select from './select';

class Group extends Component {
    constructor() {
        super();

        this.state = {
            selectedCountries: ['', '', '', '']
        }
    }

    componentWillMount() {
        if (!!this.props.previousSelection && this.props.previousSelection.length > 0) {
            this.setState({selectedCountries: this.props.previousSelection});
        }
    }

    render() {
        let selectedCountries = this.state.selectedCountries;

        return (
            <div className="group">
                <h3 className="group__title text-center">Group: {this.props.title}</h3>

                <div className="group__body">
                    {([0, 1, 2, 3]).map(index => (
                        <div key={index}>
                            <div className="form-group align-items-center">
                                <label>{index + 1}.</label>

                                <Select
                                    index={index}
                                    value={selectedCountries[index]}
                                    onChange={this._handleChangeCountry.bind(this)}
                                    options={this.props.options} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    _handleChangeCountry(index, value) {
        let selectedCountries = this.state.selectedCountries;
        selectedCountries[index] = value;

        this.setState({selectedCountries});

        this.props.handleChangeCountry(selectedCountries);
    }
};

export default Group;