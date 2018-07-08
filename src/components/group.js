import React, {Component} from 'react';

import Select from './select';

class Loading extends Component {
    constructor() {
        super();

        this.state = {
            selectedCountries: ['', '', '', '']
        }
    }

    render() {
        let selectedCountries = this.state.selectedCountries;

        return (
            <div className="group">
                <h2 className="group__title text-center">{this.props.title}</h2>

                <div className="group__body">
                    {([0, 1, 2, 3]).map(index => (
                        <Select
                            value={selectedCountries[index]}
                            onChange={this.handleChangeCountry.bind(this)}
                            options={this.props.options} />
                    ))}
                </div>
            </div>
        )
    }

    handleChangeCountry() {
        this.props.handleChangeCountry(this.props.index, this.state.selectedCountries);
    }
};

export default Loading;