import { Component } from 'react';
import Select from 'react-select';
import { hh, h, div } from 'react-hyperscript-helpers';
import { InputField } from './InputField';
import './InputField.css';

export const InputFieldSelect = hh(class InputFieldSelect extends Component {

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
    let edited = false;

    if (this.props.edit || this.props.edit === undefined) {
      if (current.length !== future[0].length) {
        edited = true;
      }

      if (future[0].length !== 0 && edited) {
        current.forEach((element, index) => {
          if (future[index] !== undefined && element.key !== future[index].key) {
            edited = true;
          }
        });
      }
    }

    return edited;
  };

  render() {

    console.log(this.props.label);
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

    if (this.props.value.length === 0) {
      value.push("");
    } else {
      value.push(this.props.value);
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
        label: this.props.label, moreInfo: this.props.moreInfo, error: this.props.error, errorMessage: this.props.errorMessage,
        readOnly: this.props.readOnly, value: this.props.value, currentValue: this.props.currentValue, currentValueStr: currentValueStr, 
        edited : edited
      }, [
          div({ className: "inputFieldSelectWrapper" }, [
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
            })
          ])
        ])
    )
  }
});
