import { Component, Fragment } from 'react';
import { input, hh, h } from 'react-hyperscript-helpers';
import { InputFieldText } from './InputFieldText';
import { InputFieldSelect } from './InputFieldSelect';

export const Funding = hh(class Funding extends Component {

  render() {
    return h(Fragment, { key: this.props.id }, [
      InputFieldSelect({ /*name: "source",*/
                         options: this.props.options,
                         label: this.props.sourceLabel,
                         value: this.props.source }),

      InputFieldText({ id: this.props.id,
                       name: "sponsor",
                       label: this.props.sponsorLabel,
                       value: this.props.sponsor,
                       disabled: false,
                       required: false,
                       onChange: this.props.inputHandler}),

      InputFieldText({ id: this.props.id,
                       name: "identifier",
                       label: this.props.identifierLabel,
                       value: this.props.identifier,
                       disabled: false,
                       required: false,
                       onChange: this.props.inputHandler })
    ]
    )
  }
});

/*
id: "inputProjectManager",
            name: "projectManager",
            label: "Broad Project Manager",
            value: this.state.formData.projectManager,
            disabled: false,
            required: false,
            onChange: this.handleInputChange
            */