import React, {Component} from 'react';

class Select extends Component {
    render() {
        return (
            <select value={this.props.value} onChange={(event) => {this.props.onChange(this.props.index, event.target.value)}} className="form-control">
                <option name="" value=""></option>
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