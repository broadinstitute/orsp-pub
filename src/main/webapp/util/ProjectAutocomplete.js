import React from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { UrlConstants } from "./UrlConstants";

class ProjectAutocomplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onChange: props.onChange,
            searchUrl: UrlConstants.projectKeySearchUrl,
            allowNew: false,
            isLoading: false,
            multiple: false,
            options: props.defaultSelected
        };
        this.clear = this.clear.bind(this);
        ProjectAutocomplete.formatLabel = ProjectAutocomplete.formatLabel.bind(this);
    }

    clear() {
        this.refs.projectAutocomplete.getInstance().clear();
        this.refs.projectAutocomplete.getInstance().blur();
    }

    componentDidMount() {
        const defaultOptions = this.state.options;
        if (defaultOptions.length === 1) {
            const option = defaultOptions[0];
            const instance = this.refs.projectAutocomplete.getInstance();
            instance.setState({
                text: ProjectAutocomplete.formatLabel(option)
            })
        }
    }

    static formatLabel(option) {
        return option ? `${option.projectKey} [${option.type}]: ${option.summary}` : "";
    }


    render() {
        return (
            <div>
                <AsyncTypeahead
                    ref="projectAutocomplete"
                    labelKey={option => ProjectAutocomplete.formatLabel(option)}
                    align={'left'}
                    isLoading={this.state.isLoading}
                    onChange={this.state.onChange}
                    onSearch={query => {
                        this.setState(() => ({isLoading: true}));
                        fetch(this.state.searchUrl + "?term=" + query)
                            .then(resp => resp.json())
                            .then(json => this.setState(() => ({
                                isLoading: false,
                                options: json,
                            })));
                    }}
                    options={this.state.options}/>
            </div>
        );
    }

}

export default ProjectAutocomplete;
