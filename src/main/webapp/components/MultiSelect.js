import { Component } from 'react';
import { hh, h } from 'react-hyperscript-helpers';
import { InputField } from './InputField';
import AsyncSelect from 'react-select/lib/Async';

export const MultiSelect = hh(class MultiSelect extends Component {

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  render() {

    return (
      InputField({ label: this.props.label }, [
        h(AsyncSelect, {
          id: this.props.id,
          isDisabled: this.props.isDisabled,
          isMulti: false,
          loadOptions: (query, callback) => this.props.loadOptions(query, callback),
          onChange: (option) => this.props.handleChange(option),
          value: this.props.value,
          placeholder: "Please select one or more individuals",
          className: "select-autocomplete",
          classNamePrefix: "select"
        })

      ]))
  }
});
