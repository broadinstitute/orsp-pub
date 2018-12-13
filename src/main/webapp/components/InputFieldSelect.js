import { Component } from 'react';
import React from 'react';
import Select from 'react-select';
import { hh } from 'react-hyperscript-helpers';
import { InputField } from './InputField';
import './InputField.css';

export const InputFieldSelect = hh(class InputFieldSelect extends Component {

  render() {

    return (
      InputField({ label: this.props.label, aclaration: this.props.aclaration }, [
        <Select
          id={this.props.id}
          name={this.props.name}
          value={this.props.value}
          onChange={this.props.onChange(this.props.id)}
          options={this.props.options}
        />
      ]
      ))
  }
});
