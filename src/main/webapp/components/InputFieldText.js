import { Component } from 'react';
import { input, hh } from 'react-hyperscript-helpers';
import { InputField } from './InputField';
import './InputField.css';

export const InputFieldText = hh(class InputFieldText extends Component {

  render() {

    return (
      InputField({ label: this.props.label, aclaration: this.props.aclaration }, [
        input({ type: 'text',
                id: this.props.id,
                name: this.props.name,
                className: "form-control inputFieldText",
                value: this.props.value,
                disabled: this.props.disabled,
                required: this.props.required,
                onChange: this.props.onChange })
      ])
    )
  }
});

