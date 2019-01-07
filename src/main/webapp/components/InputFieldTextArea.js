import { Component } from 'react';
import { React } from 'react';
import { hh, textarea } from 'react-hyperscript-helpers';
import { InputField } from './InputField';
import './InputField.css';

export const InputFieldTextArea = hh(class InputFieldTextArea extends Component {

  render() {

    return (

      InputField({ label: this.props.label, moreInfo: this.props.moreInfo, error: this.props.error, errorMessage: this.props.errorMessage }, [
        textarea({
          name: this.props.name,
          id: "txt_description",
          rows: "5",
          className: "form-control inputFieldTextarea",
          onChange: this.props.onChange,
          required: this.props.required,
          disabled: this.props.disabled,
          value: this.props.readOnly && (this.props.value === undefined || this.props.value === '') ? '--' : this.props.value,
        })
      ])
    )
  }
});
