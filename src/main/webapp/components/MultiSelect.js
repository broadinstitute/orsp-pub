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

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  sortByKey = (array, key) => {
    return array.sort(function (a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  };

  isEdited = (current, future) => {
    if (current.length !== future.length) {
      return true;
    }

    let edited = false;
    current.forEach((element, index) => {
      if (element.key !== future[index].key) {
        edited = true;
      }
    });

    return edited;
  }

  render() {

    const { currentValue = [] } = this.props;
    const value = [];
    value.push(this.props.value);

    let currentValues = [];
    if (currentValue.length === 0) {
      currentValue.push("");
    }
    currentValue.forEach(item => {
      currentValues.push(item.label);
    });

    let currentKeys = this.sortByKey(currentValue, 'key');
    let keys = this.sortByKey(value, 'key');

    let currentValueStr = currentValues.join(',');

    // verified if edited ...
    const edited = this.isEdited(currentKeys, keys);

    return (
      InputField({
        label: this.props.label, error: this.props.error, errorMessage: this.props.errorMessage, readOnly: this.props.readOnly,
        value: this.props.value, currentValue: currentValue, currentValueStr: currentValueStr, edited: edited
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
