import React from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { UrlConstants } from "./UrlConstants";
import { Search } from './ajax';
import 'react-bootstrap-typeahead/css/Typeahead.css';

class UserAutocomplete extends React.Component {
    constructor(props) {
        super(props);
        this.userNameRef = React.createRef();
        this.state = {
            onChange: props.onChange,
            allowNew: false,
            isLoading: false,
            multiple: false,
            options: props.defaultSelected
        };
        this.clear = this.clear.bind(this);
        UserAutocomplete.formatLabel = UserAutocomplete.formatLabel.bind(this);
    }

    clear() {
        this.userNameRef.current.clear()
        this.userNameRef.current.blur()
    }

    componentDidMount() {
        const defaultOptions = this.state.options;
        if (defaultOptions.length === 1) {
            const option = defaultOptions[0];
            const instance = this.userNameRef.current;
            instance.setState({
                text: UserAutocomplete.formatLabel(option)
            })
        }
    }

    static formatLabel(option) {
        return option ? `${option.label}` : "";
    }

    render() {
        return (
            <div>
                <AsyncTypeahead
                    id="userName"
                    ref={this.userNameRef}
                    labelKey={option => UserAutocomplete.formatLabel(option)}
                    align={'left'}
                    isLoading={this.state.isLoading}
                    onChange={this.state.onChange}
                    onSearch={query => {
                        this.setState(() => ({isLoading: true}));
                        Search.getMatchingUsers(query)
                            .then(response => this.setState(() => ({
                                isLoading: false,
                                options: response.data
                            })));
                    }}
                    options={this.state.options}/>
            </div>
        );
    }

}

export default UserAutocomplete;
