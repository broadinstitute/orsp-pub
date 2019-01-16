import { Component } from 'react';
import Select from 'react-select';
import { hh, h } from 'react-hyperscript-helpers';
import { InputField } from './InputField';
import './InputField.css';

export const InputFieldSelect = hh(class InputFieldSelect extends Component {

  render() {
    return (
      InputField({
        label: this.props.label, moreInfo: this.props.moreInfo, error: this.props.error, errorMessage: this.props.errorMessage,
        readOnly: this.props.readOnly, currentValue: this.props.currentValue
      }, [
          h(Select, {
            id: this.props.id,
            index: this.props.index,
            name: this.props.name,
            value: this.props.readOnly && (this.props.value === undefined || this.props.value === '') ? '--' : this.props.value,
            className: "inputFieldSelect",
            onChange: this.props.onChange(this.props.index),
            options: this.props.options,
            placeholder: this.props.placeholder,
            isMulti: this.props.isMulti
          }
          )
        ]
      ))
  }
});
