import React, {Component} from 'react';
import {PacmanLoader} from 'react-spinners';

class Loading extends Component {
    render() {
        return (
            <div className="row justify-content-md-center">
                <div className="col-xs">
                    <PacmanLoader
                        color={this.props.color || '#ab2023'}
                        loading={this.props.loading}
                        margin={'2px'}
                    />
                </div>
            </div>
        )
    }
};

export default Loading;