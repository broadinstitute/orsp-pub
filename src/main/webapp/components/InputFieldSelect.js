import { Component } from 'react';
import React from 'react';
import Select from 'react-select';
import { hh } from 'react-hyperscript-helpers';
import { InputField } from './InputField';
import './InputField.css';

export const InputFieldSelect = hh(class InputFieldSelect extends Component {

  render() {
    return (
      InputField({ label: this.props.label, moreInfo: this.props.moreInfo, error: this.props.error, errorMessage: this.props.errorMessage }, [
        <Select
          id={this.props.id}
          name={this.props.name}
          value={this.props.value}
          className="inputFieldSelect"
          onChange={this.props.onChange(this.props.id)}
          options={this.props.options}
        />
      ]
      ))
  }
});
