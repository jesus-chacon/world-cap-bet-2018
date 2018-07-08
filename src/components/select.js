import React, {Component} from 'react';

class Select extends Component {
    render() {
        return (
            <select value={this.props.value} onChange={this.props.onChange} className="form-control">
                {this.props.options.map(option => (
                    <option key={option.id} name={option.name} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
        )
    }
};

export default Select;