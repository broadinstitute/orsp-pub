import { Component } from 'react';
import { input, hh, div } from 'react-hyperscript-helpers';
import { InputField } from './InputField';
import { areSomeTheseThingsTruthy } from '../util/Utils';
import { isEmpty } from '../util/Utils';
import './InputField.css';

export const InputFieldText = hh(class InputFieldText extends Component {

  render() {

    const { value, currentValue } = this.props;
    const edited = value !== currentValue && currentValue !== undefined
      || areSomeTheseThingsTruthy([this.props.valueEdited, this.props.edit]) 
      && value !== currentValue && currentValue === undefined && value !== '';
    return (
      InputField({
        label: this.props.label, moreInfo: this.props.moreInfo, error: this.props.error, errorMessage: this.props.errorMessage,
        readOnly: this.props.readOnly, value: this.props.value, currentValue: this.props.currentValue, edited: edited
      }, [
          div({ className: "inputFieldWrapper" }, [
            input({
              type: 'text',
              id: this.props.id,
              index: this.props.index,
              name: this.props.name,
              className: "form-control inputFieldText",
              value: (this.props.value === undefined || this.props.value === '') ? '' : this.props.value,
              placeholder: ((this.props.placeholder === undefined || this.props.placeholder === '') && this.props.readOnly) ? '--' : this.props.placeholder,
              disabled: this.props.disabled,
              required: this.props.required,
              onChange: this.props.onChange,
              onBlur: this.props.focusOut
            })
          ])
        ])
    )
  }
});
