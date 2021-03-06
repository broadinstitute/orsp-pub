import { Component } from 'react';
import { hh, h, div } from 'react-hyperscript-helpers';
import { InputField } from './InputField';
import AsyncSelect from 'react-select/lib/Async';
import './InputField.css';

export const MultiSelect = hh(class MultiSelect extends Component {

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  sortByKey = (array, key) => {
    if (Array.isArray(array)) {
      return array.sort(function (a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
    }
    return array;

  };

  isEdited = (current, future) => {
    let edited = false;
    if (this.props.edit || this.props.edit === undefined) {
      if (current.length !== future.length) {
        return true;
      }
      if (Array.isArray(current)) {
        current.forEach((element, index) => {
          if (future[index] !== undefined) {
            if (element.key !== future[index].key) {
              edited = true;
            }
          }
        });
      }
    }
    return edited;
  };

  render() {

    let currentValue  = [];
    let value = [];

    let currentValues = [];

    if (this.props.currentValue === undefined) {
      currentValue.push("");
    } else if (this.props.currentValue.length === 0){
      currentValue.push("");
    } else {
      currentValue = this.props.currentValue;
    }

    if (this.props.value === null || this.props.value.length === 0) {
      value.push("");
    } else {
      value = this.props.value;
    }

    currentValue.forEach(item => {
      currentValues.push(item.label);
    });

    let currentKeys = this.sortByKey(currentValue, 'key');
    let keys = this.sortByKey(value, 'key');

    let currentValueStr = currentValues.join(', ');

    // verified if edited ...
    const edited = this.isEdited(currentKeys, keys);

    return (
      InputField({
        label: this.props.label,
        error: this.props.error,
        errorMessage: this.props.errorMessage,
        readOnly: this.props.readOnly,
        value: this.props.value,
        currentValue: currentValue,
        currentValueStr: currentValueStr,
        edited: edited
      }, [
          div({ className: "inputFieldSelectWrapper" }, [
            h(AsyncSelect, {
              id: this.props.id,
              isDisabled: this.props.isDisabled || this.props.readOnly,
              isMulti: this.props.isMulti,
              isClearable: true,
              loadOptions: (query, callback) => this.props.loadOptions(query, callback),
              onChange: (option) => this.props.handleChange(option),
              value: this.props.readOnly && (this.props.value === undefined || this.props.value === '') ? '--' : this.props.value,
              placeholder: !this.props.readOnly && this.props.placeholder !== undefined ? this.props.placeholder : '--',
              className: "inputFieldSelect",
              classNamePrefix: "select",
              styles: this.props.styles
            })
          ])
        ])
    )
  }
});
