import { Component } from 'react';
import { input, hh } from 'react-hyperscript-helpers';
import { InputField } from './InputField';
import './InputField.css';

export const InputFieldText = hh(class InputFieldText extends Component {

  render() {

    return (
      InputField({ label: this.props.label, moreInfo: this.props.moreInfo, error: this.props.error, errorMessage: this.props.errorMessage }, [
        input({
          type: 'text',
          id: this.props.id,
          index: this.props.index,
          name: this.props.name,
          className: "form-control inputFieldText" + (this.props.readOnly ? " readOnly" : ""),
          value: this.props.readOnly && (this.props.value === undefined || this.props.value === '') ? '--' : this.props.value,
          disabled: this.props.disabled,
          required: this.props.required,
          onChange: this.props.onChange,
          onBlur: this.props.focusOut
        })
      ])
    )
  }
});
