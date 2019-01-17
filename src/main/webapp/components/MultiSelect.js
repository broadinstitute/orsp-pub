import { Component } from 'react';
import { hh, h, div } from 'react-hyperscript-helpers';
import { InputField } from './InputField';
import AsyncSelect from 'react-select/lib/Async';

export const MultiSelect = hh(class MultiSelect extends Component {

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  render() {

    const { currentValue = [] } = this.props;

    let values = [];
    currentValue.forEach(value => {
      values.push(value.label);
    });

    let currentValueStr = values.join(',');

    return (
      InputField({
        label: this.props.label, error: this.props.error, errorMessage: this.props.errorMessage, readOnly: this.props.readOnly,
        currentValue: currentValue, currentValueStr: currentValueStr
      }, [
          div({ className: "inputFieldSelectWrapper" }, [
            h(AsyncSelect, {
              id: this.props.id,
              isDisabled: this.props.isDisabled,
              isMulti: this.props.isMulti,
              isClearable: true,
              loadOptions: (query, callback) => this.props.loadOptions(query, callback),
              onChange: (option) => this.props.handleChange(option),
              value: this.props.readOnly && (this.props.value === undefined || this.props.value === '') ? '--' : this.props.value,
              placeholder: this.props.placeholder !== undefined ? this.props.placeholder : '--',
              className: "inputFieldSelect",
              classNamePrefix: "select"
            })
          ])
        ])
    )
  }
});
