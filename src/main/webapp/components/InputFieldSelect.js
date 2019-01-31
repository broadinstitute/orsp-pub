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

  isEdited = (current, futureValue) => {
    return current !== futureValue
  };

  render() {
    const edited = this.isEdited(this.props.currentValue.value, this.props.value.value);

    return (
      InputField({
        label: this.props.label,
        moreInfo: this.props.moreInfo,
        error: this.props.error,
        errorMessage: this.props.errorMessage,
        readOnly: this.props.readOnly,
        value: this.props.value,
        currentValue: this.props.currentValue,
        currentValueStr: this.props.currentValue.label,
        edited : edited
      }, [
          div({ className: "inputFieldSelectWrapper" }, [
            h(Select, {
              id: this.props.id,
              index: this.props.index,
              name: this.props.name,
              value: this.props.value,
              className: "inputFieldSelect",
              onChange: this.props.onChange(this.props.index),
              options: this.props.options,
              placeholder: edited ? '--' : this.props.placeholder,
              isMulti: this.props.isMulti
            })
          ])
        ])
    )
  }
});
