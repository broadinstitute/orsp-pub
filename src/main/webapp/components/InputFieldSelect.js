import { Component } from 'react';
import React from 'react';
import Select from 'react-select';
import { hh } from 'react-hyperscript-helpers';
import { InputField } from './InputField';


export const InputFieldSelect = hh(class InputFieldSelect extends Component {

  state = {
    value: '',
    selectedOption: null
  };

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  }

  render() {

    return (
      InputField({ label: this.props.label }, [
        <Select
          value={this.state.selectedOption}
          onChange={this.handleChange}
          options={this.props.options}
        />
      ]
      ))
  }
});
