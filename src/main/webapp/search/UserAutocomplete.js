
import React from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

class UserAutocomplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onChange: props.onChange,
            userNameSearchUrl: props.userNameSearchUrl,
            allowNew: false,
            isLoading: false,
            multiple: false,
            options: props.defaultSelected
        };
        this.clear = this.clear.bind(this);
        UserAutocomplete.formatLabel = UserAutocomplete.formatLabel.bind(this);
    }

    clear() {
        this.refs.userName.getInstance().clear();
        this.refs.userName.getInstance().blur();
    }

    componentDidMount() {
        const defaultOptions = this.state.options;
        if (defaultOptions.length === 1) {
            const option = defaultOptions[0];
            this.refs.userName.getInstance()._updateText(UserAutocomplete.formatLabel(option));
        }
    }

    static formatLabel(option) {
        return option ? `${option.label}` : "";
    }

    render() {
        return (
            <div>
                <AsyncTypeahead
                    ref="userName"
                    labelKey={option => UserAutocomplete.formatLabel(option)}
                    align={'left'}
                    isLoading={this.state.isLoading}
                    onChange={this.state.onChange}
                    onSearch={query => {
                        this.setState({isLoading: true});
                        fetch(this.state.userNameSearchUrl + "?term=" + query)
                            .then(resp => resp.json())
                            .then(json => this.setState({
                                isLoading: false,
                                options: json,
                            }));
                    }}
                    options={this.state.options}/>
            </div>
        );
    }

}

export default UserAutocomplete;
