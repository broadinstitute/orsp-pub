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
          isMulti: this.props.isMulti,
          isClearable: true,
          loadOptions: (query, callback) => this.props.loadOptions(query, callback),
          onChange: (option) => this.props.handleChange(option),
          value: this.props.value,
          placeholder: this.props.placeholder,
          className: "select-autocomplete",
          classNamePrefix: "select"
        })

      ]))
  }
});
