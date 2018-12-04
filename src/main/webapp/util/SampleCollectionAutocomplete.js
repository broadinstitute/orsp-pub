import React from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

class SampleCollectionAutocomplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onChange: props.onChange,
            sampleSearchUrl: props.sampleSearchUrl,
            allowNew: false,
            isLoading: false,
            multiple: false,
            options: props.defaultSelected
        };
        this.clear = this.clear.bind(this);
        SampleCollectionAutocomplete.formatLabel = SampleCollectionAutocomplete.formatLabel.bind(this);
    }

    clear() {
        this.refs.sampleCollection.getInstance().clear();
        this.refs.sampleCollection.getInstance().blur();
    }

    componentDidMount() {
        const defaultOptions = this.state.options;
        if (defaultOptions.length === 1) {
            const option = defaultOptions[0];
            const instance = this.refs.sampleCollection.getInstance();
            instance.setState({
                text: SampleCollectionAutocomplete.formatLabel(option)
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
                    ref="sampleCollection"
                    labelKey={option => SampleCollectionAutocomplete.formatLabel(option)}
                    align={'left'}
                    isLoading={this.state.isLoading}
                    onChange={this.state.onChange}
                    onSearch={query => {
                        this.setState(() => ({isLoading: true}));
                        fetch(this.state.sampleSearchUrl + "?term=" + query)
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

export default SampleCollectionAutocomplete;
