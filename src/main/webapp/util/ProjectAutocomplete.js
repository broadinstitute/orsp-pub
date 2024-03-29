import React from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { UrlConstants } from "./UrlConstants";
import { Search } from './ajax';

class ProjectAutocomplete extends React.Component {
    constructor(props) {
        super(props);
        this.projectAutocompleteRef = React.createRef();
        this.state = {
            onChange: props.onChange,
            allowNew: false,
            isLoading: false,
            multiple: false,
            options: props.defaultSelected
        };
        this.clear = this.clear.bind(this);
        ProjectAutocomplete.formatLabel = ProjectAutocomplete.formatLabel.bind(this);
    }

    clear() {
        this.projectAutocompleteRef.current.clear()
        this.projectAutocompleteRef.current.blur()
    }

    componentDidMount() {
        const defaultOptions = this.state.options;
        if (defaultOptions.length === 1) {
            const option = defaultOptions[0];
            const instance = this.projectAutocompleteRef.current;
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
                    id="projectAutocomplete"
                    ref={this.projectAutocompleteRef}
                    labelKey={option => ProjectAutocomplete.formatLabel(option)}
                    align={'left'}
                    isLoading={this.state.isLoading}
                    onChange={this.state.onChange}
                    onSearch={query => {
                        this.setState(() => ({isLoading: true}));
                        Search.getMatchingProject(query)
                            .then(response => {
                              this.setState(() => ({
                                isLoading: false,
                                options: response.data,
                            }))
                            });
                    }}
                    options={this.state.options}/>
            </div>
        );
    }

}

export default ProjectAutocomplete;
